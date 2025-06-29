import { decimal, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createOrdersTable } from './createOrders'
import { productsTable } from './products'

export const createOrdersProductsTable = pgTable('orders_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('orderId').references(() => createOrdersTable.id, {
    onDelete: 'set null',
  }),
  productId: uuid('productId').references(() => productsTable.id, {
    onDelete: 'set null',
  }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
