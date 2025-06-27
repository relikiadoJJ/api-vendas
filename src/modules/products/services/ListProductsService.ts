import { db } from '@shared/drizzle/db'
import { productsTable } from '@shared/drizzle/db/schema/products'

export class ListProductsService {
  public async execute() {
    const products = await db.select().from(productsTable)

    return products
  }
}
