import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';
import postgres from 'postgres';

export const notes = pgTable('note', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export type Note = InferModel<typeof notes>;
export type NewNote = InferModel<typeof notes, 'insert'>;

const client = postgres(process.env['DATABASE_URL'] ?? '');
export const db = drizzle(client);
