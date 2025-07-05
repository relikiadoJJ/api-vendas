import { db } from '@shared/drizzle/db'
import { createOrdersTable } from '@shared/drizzle/db/schema/createOrders'
import { createOrdersProductsTable } from '@shared/drizzle/db/schema/createOrdersProducts'
import { eq } from 'drizzle-orm'

interface ISerializedProduct {
  product_id: string
  quantity: number
  price: number
}

interface ICreateOrderDTO {
  customer: {
    id: string
    name: string
  }
  products: ISerializedProduct[]
}

export class OrdersRepository {
  public async createOrder({ customer, products }: ICreateOrderDTO) {
    const [order] = await db
      .insert(createOrdersTable)
      .values({
        customerId: customer.id,
        createdAt: new Date(),
      })
      .returning()

    const orderProducts = products.map(p => ({
      orderId: order.id,
      productId: p.product_id,
      quantity: p.quantity,
      price: p.price.toFixed(2),
    }))

    await db.insert(createOrdersProductsTable).values(orderProducts)

    return {
      id: order.id,
      customerId: order.customerId,
      createdAt: order.createdAt,
      order_products: orderProducts,
    }
  }

  public async findById(id: string) {
    const [order] = await db
      .select()
      .from(createOrdersTable)
      .where(eq(createOrdersTable.id, id))

    return { order }
  }
}
