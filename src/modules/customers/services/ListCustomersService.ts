import { CustomersRepository } from '../drizzle/repositories/CustomersRepository'

export class ListCustomersService {
  private customersRepository = new CustomersRepository()

  public async execute() {
    const customers = await this.customersRepository.findMany()

    return {
      customers,
    }
  }
}
