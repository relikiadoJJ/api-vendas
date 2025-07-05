import { AppError } from '@shared/errors/AppError'
import { CustomersRepository } from '../drizzle/repositories/CustomersRepository'

interface IRequest {
  id: string
}

export class ShowCustomerService {
  private customersRepository = new CustomersRepository()

  public async execute({ id }: IRequest) {
    const customer = await this.customersRepository.findById(id)

    if (!customer) {
      throw new AppError('Customer not found.', 404)
    }

    return {
      customer,
    }
  }
}
