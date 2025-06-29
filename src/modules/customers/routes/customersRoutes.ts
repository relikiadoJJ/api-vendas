import type { FastifyInstance } from 'fastify'
import { CreateCustomerController } from '../controllers/CreateCustomerCustomer'
import { DeleteCustomerController } from '../controllers/DeleteCustomerController'
import { ListCustomersController } from '../controllers/ListCustomersController'
import { ShowCustomerController } from '../controllers/ShowCustomerController'
import { UpdateCustomerController } from '../controllers/UpdateCustomerController'

export async function customersRoutes(app: FastifyInstance) {
  app.post('/customer', CreateCustomerController)
  app.get('/customers', ListCustomersController)
  app.get('/customer/:id', ShowCustomerController)
  app.put('/customer/:id', UpdateCustomerController)
  app.delete('/customer/:id', DeleteCustomerController)
}
