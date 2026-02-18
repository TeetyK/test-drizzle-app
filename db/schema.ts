import { pgTable , serial , varchar , timestamp ,text , integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users',{
    id: serial('id').primaryKey(),
    name:varchar('name',{length:100}).notNull(),
    email:varchar('email',{length:100}).notNull().unique(),
    createdAt:timestamp('created_at').defaultNow(),
})

export const posts =pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
})