import { AppError } from '@shared/errors/AppError'
import { ProductRepository } from '../drizzle/repositories/ProductsRepository'

interface IRequest {
  name: string
  price: number
  quantity: number
}

export class CreateProductService {
  private productRepository = new ProductRepository()
  public async execute({ name, price, quantity }: IRequest) {
    const productExists = await this.productRepository.findByName(name)

    if (productExists) {
      throw new AppError('There is already one product with this name', 409)
    }

    const newProduct = await this.productRepository.create({
      name,
      price,
      quantity,
    })

    return newProduct
  }
}
