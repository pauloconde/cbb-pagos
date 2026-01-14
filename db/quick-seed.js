
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, text, integer, boolean } from 'drizzle-orm/pg-core';
import { Scrypt } from "lucia";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Define Schema Inline to avoid importing TS
const User = pgTable('user', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    password_hash: text('password_hash').notNull()
});

const Partner = pgTable('partner', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull(),
    cedula: text('cedula').notNull(),
    active: boolean('active').default(true).notNull()
});

const sql = neon("postgresql://neondb_owner:npg_YLR5buf1WwEd@ep-holy-glade-act7zujv-pooler.sa-east-1.aws.neon.tech/cbc-pagos?sslmode=require");
const db = drizzle(sql);

async function main() {
    console.log('Seeding database via JS...');

    // 1. Create Admin User
    const password = "admin_password";
    const scrypt = new Scrypt();
    const passwordHash = await scrypt.hash(password);

    try {
        await db.insert(User).values({
            id: "admin_user_id",
            username: "admin",
            password_hash: passwordHash
        }).onConflictDoNothing();
        console.log('Admin user created/verified.');
    } catch (e) {
        console.error('Error creating admin:', e);
    }

    // 2. Seed Partners
    const partners = [
        { cedula: "10315646", name: "Mario Santiago" },
        { cedula: "11186504", name: "César Medina" },
        { cedula: "11192543", name: "Jesús Piñero" },
        { cedula: "11709954", name: "Leonardo Albornoz" },
        { cedula: "11710649", name: "Lenin García" },
        { cedula: "12196236", name: "Milvier Ortiz" },
        { cedula: "13280440", name: "Juan Berrios" },
        { cedula: "18527721", name: "Jesús Moyetones" },
        { cedula: "1986405", name: "Pedro Angarita" },
        { cedula: "21431651", name: "Marconi Almagro" },
        { cedula: "26392401", name: "Andrés Camargo" },
        { cedula: "4258842", name: "Rubén Acosta" },
        { cedula: "4931262", name: "Gustavo Tapia" },
        { cedula: "-", name: "Oswaldo Materán" },
        { cedula: "80411764", name: "Paulo Conde" },
        { cedula: "8140732", name: "Antonio Materán" },
        { cedula: "9385290", name: "José Peralta" },
        { cedula: "13062891", name: "José Piñero" }
    ];

    for (const partner of partners) {
        await db.insert(Partner).values({
            name: partner.name,
            cedula: partner.cedula
        }).onConflictDoNothing();
    }
    console.log('Partners seeded.');
    console.log('Done!');
}

main();
