import { AppError } from '@shared/errors/AppError'
import { ProductRepository } from '../drizzle/repositories/ProductsRepository'

interface IRequest {
  id: string
  name: string
  price: number
  quantity: number
}

export class UpdateProductService {
  private productRepository = new ProductRepository()

  public async execute({ id, name, price, quantity }: IRequest) {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    const productExists = await this.productRepository.findByName(name)

    if (productExists) {
      throw new AppError('There is already one product with this name', 409)
    }

    const updatedProduct = await this.productRepository.updateProduct(id, {
      name,
      price,
      quantity,
    })

    return updatedProduct
  }
}
