import { db } from '@shared/drizzle/db'
import { productsTable } from '@shared/drizzle/db/schema/products'
import { AppError } from '@shared/errors/AppError'
import { eq } from 'drizzle-orm'

interface IRequest {
  id: string
  name: string
  price: number
  quantity: number
}

export class UpdateProductService {
  public async execute({ id, name, price, quantity }: IRequest) {
    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .then(res => res[0])

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    const productExists = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.name, name))
      .then(res => res[0])

    if (productExists) {
      throw new AppError('There is already one product with this name', 409)
    }

    await db
      .update(productsTable)
      .set({ name, price: price.toFixed(2), quantity, updatedAt: new Date() })
      .where(eq(productsTable.id, id))

    const updatedProduct = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .then(res => res[0])

    return updatedProduct
  }
}
