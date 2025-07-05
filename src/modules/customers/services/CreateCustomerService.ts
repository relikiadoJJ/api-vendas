import { AppError } from '@shared/errors/AppError'
import { CustomersRepository } from '../drizzle/repositories/CustomersRepository'

interface IRequest {
  name: string
  email: string
}

export class CreateCustomerService {
  private customersRepository = new CustomersRepository()

  public async execute({ name, email }: IRequest) {
    const emailExists = await this.customersRepository.findByEmail(email)

    if (emailExists) {
      throw new AppError('Email address already user.', 409)
    }

    const customer = await this.customersRepository.create({ name, email })

    return customer
  }
}
