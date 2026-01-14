import { defineDb, defineTable, column } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    username: column.text({ unique: true }),
    password_hash: column.text(),
  }
});

const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    expiresAt: column.date(),
  }
});

const Partner = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    cedula: column.text({ unique: true }),
    active: column.boolean({ default: true }),
  }
});

const Payment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    partnerId: column.number({ references: () => Partner.columns.id }),
    year: column.number(),
    month: column.number(),
    amount: column.number(),
    date: column.date({ default: new Date() }),
  }
});

export default defineDb({
  tables: { User, Session, Partner, Payment },
});
