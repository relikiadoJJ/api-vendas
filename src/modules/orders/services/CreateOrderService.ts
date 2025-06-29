import { db } from '@shared/drizzle/db/index'
import { customersTable } from '@shared/drizzle/db/schema/customers'
import { productsTable } from '@shared/drizzle/db/schema/products'
import { AppError } from '@shared/errors/AppError'
import { eq } from 'drizzle-orm'

interface IProduct {
  id: string
  quantity: number
}

interface IRequest {
  customerId: string
  products: IProduct[]
}

export class CreateOrderService {
  public async execute({ customerId, products }: IRequest) {
    const customerExists = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.id, customerId))
      .then(res => res[0])

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given ud', 404)
    }

    const existsProducts = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, products.id))

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
