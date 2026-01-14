import { lucia } from "../../auth";
import { db } from "../../db";
import { User } from "../../db/schema";
import { eq } from "drizzle-orm";
import { Scrypt } from "oslo/password";
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (typeof username !== "string" || username.length < 3 || username.length > 31) {
        return new Response("Invalid username", { status: 400 });
    }
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return new Response("Invalid password", { status: 400 });
    }

    // Initialize user lookup
    const users = await db.select().from(User).where(eq(User.username, username));
    const existingUser = users[0];

    if (!existingUser) {
        // NOTE:
        // Returning immediately allows malicious actors to figure out valid usernames from response times,
        // allowing them to only focus on guessing passwords in brute-force attacks.
        // As a preventive measure, you may want to hash passwords even for invalid usernames.
        // However, valid usernames can be already be revealed with the signup page among other methods.
        // It will also be much more resource intensive.
        // Since protecting against this is non-trivial,
        // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
        // For this example/demo, we'll keep it simple.
        return new Response("Incorrect username or password", { status: 400 });
    }

    const validPassword = await new Scrypt().verify(existingUser.password_hash, password);
    if (!validPassword) {
        return new Response("Incorrect username or password", { status: 400 });
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return context.redirect("/admin");
}
