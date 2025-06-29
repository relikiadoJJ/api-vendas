import { ProductRepository } from '../drizzle/repositories/ProductsRepository'

export class ListProductsService {
  private productRepository = new ProductRepository()

  public async execute() {
    const products = await this.productRepository.findManyProduct()

    return products
  }
}
