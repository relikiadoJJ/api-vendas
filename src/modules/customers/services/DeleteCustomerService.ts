import { AppError } from '@shared/errors/AppError'
import { CustomersRepository } from '../drizzle/repositories/CustomersRepository'

interface IRequest {
  id: string
}

export class DeleteCustomerService {
  private customersRepository = new CustomersRepository()

  public async execute({ id }: IRequest) {
    const customer = await this.customersRepository.findById(id)

    if (!customer) {
      throw new AppError('Customer not found.', 404)
    }

    const deleteCustomer = await this.customersRepository.deleteCustomer(id)

    return {
      deleteCustomer,
    }
  }
}
