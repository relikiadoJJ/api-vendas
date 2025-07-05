import { RedisCache } from '@shared/cache/RedisCache'
import { ProductRepository } from '../drizzle/repositories/ProductsRepository'

export class ListProductsService {
  private productRepository = new ProductRepository()

  public async execute() {
    const redisCache = new RedisCache()

    let products = await redisCache.recover('api-vendas-PRODUCTS_LIST')

    if (!products) {
      products = await this.productRepository.findManyProduct()

      await redisCache.save('api-vendas-PRODUCTS_LIST', products)
    }

    return products
  }
}
