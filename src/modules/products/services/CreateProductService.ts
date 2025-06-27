import { db } from '@shared/drizzle/db/index'
import { productsTable } from '@shared/drizzle/db/schema/products'
import { AppError } from '@shared/errors/AppError'
import { eq } from 'drizzle-orm'

interface IRequest {
  name: string
  price: number
  quantity: number
}

export class CreateProductService {
  public async execute({ name, price, quantity }: IRequest) {
    const productExists = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.name, name))
      .then(res => res[0])

    if (productExists) {
      throw new AppError('There is already one product with this name', 409)
    }

    const newProduct = await db
      .insert(productsTable)
      .values({ name, price: price.toFixed(2), quantity })
      .returning()
      .then(res => ({
        ...res[0],
        price: parseFloat(res[0].price),
      }))

    return newProduct
  }
}
