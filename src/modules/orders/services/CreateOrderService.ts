import { CustomersRepository } from '@modules/customers/drizzle/repositories/CustomersRepository'
import { ProductRepository } from '@modules/products/drizzle/repositories/ProductsRepository'
import { AppError } from '@shared/errors/AppError'
import { OrdersRepository } from '../drizzle/repositories/OrdersRepository'

interface IProduct {
  id: string
  quantity: number
}

interface IRequest {
  customerId: string
  products: IProduct[]
}

export class CreateOrderService {
  private ordersRepository = new OrdersRepository()
  private customersRepository = new CustomersRepository()
  private productRepository = new ProductRepository()

  public async execute({ customerId, products }: IRequest) {
    const customerExists = await this.customersRepository.findById(customerId)

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id', 404)
    }

    const existsProducts = await this.productRepository.findAllByIds(products)

    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids.', 404)
    }

    const existsProductsIds = existsProducts.map(p => p.id)

    const checkInexistentProducts = products.filter(
      p => !existsProductsIds.includes(p.id)
    )

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}.`
      )
    }

    const quantityUnavailable = products.filter(product => {
      const dbProduct = existsProducts.find(p => p.id === product.id)
      return dbProduct && dbProduct.quantity < product.quantity
    })

    if (quantityUnavailable.length) {
      throw new AppError(
        `Insufficient quantity for product ${quantityUnavailable[0].id}. Requested: ${quantityUnavailable[0].quantity}, Available: ${
          existsProducts.find(p => p.id === quantityUnavailable[0].id)?.quantity
        }`
      )
    }

    const serializedProducts = products.map(product => {
      const found = existsProducts.find(p => p.id === product.id)

      if (!found) {
        throw new AppError(`Product ${product.id} not found while serializing.`)
      }

      return {
        product_id: found.id,
        quantity: product.quantity,
        price: parseFloat(found.price),
      }
    })

    const order = await this.ordersRepository.createOrder({
      customer: {
        id: customerExists.customer.id,
        name: customerExists.customer.name,
      },
      products: serializedProducts,
    })

    for (const product of serializedProducts) {
      const original = existsProducts.find(p => p.id === product.product_id)
      if (original) {
        await this.productRepository.updateProduct(product.product_id, {
          name: original.name,
          price: parseFloat(original.price),
          quantity: original.quantity - product.quantity,
        })
      }
    }

    return order
  }
}
