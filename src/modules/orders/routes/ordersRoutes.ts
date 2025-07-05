import type { FastifyInstance } from 'fastify'
import { CreateOrderController } from '../controllers/CreateOrderController'
import { ShowOrderController } from '../controllers/ShowOrderController'

export async function ordersRoutes(app: FastifyInstance) {
  app.post('/order', CreateOrderController)
  app.get('/order/:id', ShowOrderController)
}
