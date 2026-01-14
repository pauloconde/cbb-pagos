
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function testConnection() {
    try {
        const result = await sql`SELECT 1`;
        console.log('Connection successful:', result);
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
