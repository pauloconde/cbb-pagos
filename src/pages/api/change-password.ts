import { db } from "../../db";
import { User } from "../../db/schema";
import { eq } from "drizzle-orm";
import { Scrypt } from "oslo/password";
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
    // Check if user is authenticated
    if (!context.locals.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const body = await context.request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
        return new Response("Missing required fields", { status: 400 });
    }

    if (newPassword.length < 6) {
        return new Response("New password must be at least 6 characters", { status: 400 });
    }

    // Get current user
    const users = await db.select().from(User).where(eq(User.id, context.locals.user.id));
    const user = users[0];

    if (!user) {
        return new Response("User not found", { status: 404 });
    }

    // Verify current password
    const scrypt = new Scrypt();
    const validPassword = await scrypt.verify(user.password_hash, currentPassword);

    if (!validPassword) {
        return new Response("Contraseña actual incorrecta", { status: 400 });
    }

    // Hash new password and update
    const newPasswordHash = await scrypt.hash(newPassword);

    await db.update(User)
        .set({ password_hash: newPasswordHash })
        .where(eq(User.id, context.locals.user.id));

    return new Response("Password changed successfully", { status: 200 });
}
