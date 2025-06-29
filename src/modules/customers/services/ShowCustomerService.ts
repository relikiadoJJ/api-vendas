import { db } from '@shared/drizzle/db'
import { customersTable } from '@shared/drizzle/db/schema/customers'
import { AppError } from '@shared/errors/AppError'
import { eq } from 'drizzle-orm'

interface IRequest {
  id: string
}

export class ShowCustomerService {
  public async execute({ id }: IRequest) {
    const customer = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.id, id))
      .then(res => res[0])

    if (!customer) {
      throw new AppError('Customer not found.', 404)
    }

    return {
      customer,
    }
  }
}
