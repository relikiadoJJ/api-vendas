import type { FastifyInstance } from 'fastify'
import { CreateProductController } from '../controllers/CreateProductController'
import { DeleteProductController } from '../controllers/DeleteProductController'
import { ListProductsController } from '../controllers/ListProductsController'
import { ShowProductController } from '../controllers/ShowProductController'
import { UpdateProductController } from '../controllers/UpdateProductController'

export async function productRoutes(app: FastifyInstance) {
  app.post('/api/product', CreateProductController)
  app.get('/api/products', ListProductsController)
  app.get('/api/product/:id', ShowProductController)
  app.put('/api/product/:id', UpdateProductController)
  app.delete('/api/product/:id', DeleteProductController)
}
