import { db } from '@shared/drizzle/db'
import { customersTable } from '@shared/drizzle/db/schema/customers'
import { usersTable } from '@shared/drizzle/db/schema/users'
import { AppError } from '@shared/errors/AppError'
import { eq } from 'drizzle-orm'

interface IRequest {
  name: string
  email: string
}

export class CreateCustomerService {
  public async execute({ name, email }: IRequest) {
    const emailExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .then(res => res[0])

    if (emailExists) {
      throw new AppError('Email address already user.', 409)
    }

    const customer = await db
      .insert(customersTable)
      .values({ name, email })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      })
      .then(res => res[0])

    return customer
  }
}
