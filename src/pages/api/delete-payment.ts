import type { APIRoute } from "astro";
import { db } from "../../db";
import { Payment } from "../../db/schema";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ request, locals, redirect }) => {
    // Check authentication
    if (!locals.user) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const formData = await request.formData();
        const paymentId = Number(formData.get("paymentId"));

        if (!paymentId || isNaN(paymentId)) {
            return new Response(JSON.stringify({ error: "ID de pago inválido" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        await db.delete(Payment).where(eq(Payment.id, paymentId));

        // Redirect back to payments page
        return redirect("/admin/payments?deleted=true");
    } catch (error) {
        console.error("Error deleting payment:", error);
        return new Response(JSON.stringify({ error: "Error al eliminar el pago" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
