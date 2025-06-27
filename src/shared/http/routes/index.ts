import { productRoutes } from '@modules/products/routes/productsRoutes'
import { usersRoutes } from '@modules/users/routes/usersRoutes'
import type { FastifyInstance } from 'fastify'

export async function RoutesIndex(app: FastifyInstance) {
  app.register(productRoutes)
  app.register(usersRoutes)
}
