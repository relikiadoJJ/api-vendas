import { db } from '@shared/drizzle/db'
import { customersTable } from '@shared/drizzle/db/schema/customers'
import { AppError } from '@shared/errors/AppError'
import { eq } from 'drizzle-orm'

interface IRequest {
  id: string
  name: string
  email: string
}

export class UpdateCustomerService {
  public async execute({ id, name, email }: IRequest) {
    const custumer = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.id, id))
      .then(res => res[0])

    if (!custumer) {
      throw new AppError('Customer not found.', 404)
    }

    const userUpdateEmail = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.email, email))
      .then(res => res[0])

    if (userUpdateEmail && userUpdateEmail.id !== id) {
      throw new AppError('There is already one user with this email')
    }

    const updateData: Partial<typeof customersTable.$inferInsert> = {
      name,
      email,
    }

    await db
      .update(customersTable)
      .set(updateData)
      .where(eq(customersTable.id, id))

    const updatedCustomer = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.id, id))
      .then(res => res[0])

    return updatedCustomer
  }
}
