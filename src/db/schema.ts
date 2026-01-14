
import { pgTable, text, timestamp, boolean, integer, real } from 'drizzle-orm/pg-core';

export const User = pgTable('user', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    password_hash: text('password_hash').notNull()
});

export const Session = pgTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => User.id),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const Partner = pgTable('partner', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(), // Using Identity for auto-increment in Postgres
    name: text('name').notNull(),
    cedula: text('cedula').notNull(),
    active: boolean('active').default(true).notNull()
});

export const Payment = pgTable('payment', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    partnerId: integer('partner_id').notNull().references(() => Partner.id),
    amount: real('amount').notNull(),
    currency: text('currency').default('USD').notNull(),
    method: text('method').notNull(), // 'pago_mobil', 'zelle', 'efectivo'
    reference: text('reference'),
    date: timestamp('date', { withTimezone: true }).defaultNow().notNull(),
    month: integer('month').notNull(), // 0-11
    year: integer('year').notNull()
});
