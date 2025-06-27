import { db } from '@shared/drizzle/db'
import { productsTable } from '@shared/drizzle/db/schema/products'
import { AppError } from '@shared/errors/AppError'
import { eq } from 'drizzle-orm'

interface IRequest {
  id: string
}

export class ShowProductService {
  public async execute({ id }: IRequest) {
    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .then(res => res[0])

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    return product
  }
}
