
import { db } from "../../db";
import { Partner } from "../../db/schema";
import { eq } from "drizzle-orm";
import type { APIContext } from "astro";

export async function GET({ request }: APIContext): Promise<Response> {
    try {
        const partners = await db
            .select({
                name: Partner.name,
                id: Partner.id
            })
            .from(Partner)
            .where(eq(Partner.active, true));

        return new Response(JSON.stringify(partners), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error fetching partners:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
