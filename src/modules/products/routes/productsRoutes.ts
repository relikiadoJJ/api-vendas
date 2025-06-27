import type { FastifyInstance } from 'fastify'
import { CreateProductController } from '../controllers/CreateProductController'
import { DeleteProductController } from '../controllers/DeleteProductController'
import { ListProductsController } from '../controllers/ListProductsController'
import { ShowProductController } from '../controllers/ShowProductController'
import { UpdateProductController } from '../controllers/UpdateProductController'

export async function productRoutes(app: FastifyInstance) {
  app.post('/product', CreateProductController)
  app.get('/products', ListProductsController)
  app.get('/product/:id', ShowProductController)
  app.put('/product/:id', UpdateProductController)
  app.delete('/product/:id', DeleteProductController)
}
