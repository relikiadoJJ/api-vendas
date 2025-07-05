import { db } from '@shared/drizzle/db'
import { productsTable } from '@shared/drizzle/db/schema/products'
import { eq, inArray } from 'drizzle-orm'

interface ICreateProductDTO {
  name: string
  price: number
  quantity: number
}

interface IFindProducts {
  id: string
}

export class ProductRepository {
  public async create({ name, price, quantity }: ICreateProductDTO) {
    const [createdProduct] = await db
      .insert(productsTable)
      .values({
        name,
        price: price.toFixed(2),
        quantity,
      })
      .returning()

    return {
      ...createdProduct,
      price: parseFloat(createdProduct.price),
    }
  }

  public async findByName(name: string) {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.name, name))

    return product
  }

  public async findById(id: string) {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))

    return product
  }

  public async deleteProduct(id: string) {
    const product = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))

    return product
  }

  public async findManyProduct() {
    return await db.select().from(productsTable)
  }

  public async updateProduct(
    id: string,
    data: { name: string; price: number; quantity: number }
  ) {
    await db
      .update(productsTable)
      .set({
        name: data.name,
        price: data.price.toFixed(2),
        quantity: data.quantity,
        updatedAt: new Date(),
      })
      .where(eq(productsTable.id, id))

    const [updatedProduct] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))

    return updatedProduct
  }

  public async findAllByIds(products: IFindProducts[]) {
    const productIds = products.map(product => product.id)

    const existsProducts = await db
      .select()
      .from(productsTable)
      .where(inArray(productsTable.id, productIds))

    return existsProducts
  }
}
