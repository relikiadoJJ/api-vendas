import { RedisCache } from '@shared/cache/RedisCache'
import { AppError } from '@shared/errors/AppError'
import { ProductRepository } from '../drizzle/repositories/ProductsRepository'

interface IRequest {
  id: string
}

export class DeleteProductService {
  private productRepository = new ProductRepository()

  public async execute({ id }: IRequest) {
    const redisCache = new RedisCache()

    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    await redisCache.invalidate('api-vendas-PRODUCTS_LIST')

    const deleteProduct = await this.productRepository.deleteProduct(id)

    return deleteProduct
  }
}
