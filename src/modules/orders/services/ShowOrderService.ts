import { AppError } from '@shared/errors/AppError'
import { OrdersRepository } from '../drizzle/repositories/OrdersRepository'

interface IRequest {
  id: string
}

export class ShowOrderService {
  private ordersRepository = new OrdersRepository()

  public async execute({ id }: IRequest) {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      throw new AppError('Order not found', 404)
    }

    return order
  }
}
