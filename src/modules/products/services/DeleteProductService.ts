import { AppError } from '@shared/errors/AppError'
import { ProductRepository } from '../drizzle/repositories/ProductsRepository'

interface IRequest {
  id: string
}

export class DeleteProductService {
  private productRepository = new ProductRepository()

  public async execute({ id }: IRequest) {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    const deleteProduct = await this.productRepository.deleteProduct(id)

    return deleteProduct
  }
}
