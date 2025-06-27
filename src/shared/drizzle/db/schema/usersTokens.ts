import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { usersTable } from './users'

export const usersTokenTable = pgTable('usersToken', {
  id: uuid('id').primaryKey().defaultRandom(),
  token: uuid('token').defaultRandom().unique(),
  userId: uuid('userId')
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
