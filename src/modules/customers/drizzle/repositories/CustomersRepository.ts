import { db } from '@shared/drizzle/db'
import { customersTable } from '@shared/drizzle/db/schema/customers'
import { eq } from 'drizzle-orm'

interface ICreateCustomersDTO {
  name: string
  email: string
}

export class CustomersRepository {
  public async create({ name, email }: ICreateCustomersDTO) {
    const createdCustomer = await db
      .insert(customersTable)
      .values({ name, email })
      .returning({
        id: customersTable.id,
        name: customersTable.name,
        email: customersTable.email,
      })
      .then(res => res[0])

    return {
      createdCustomer,
    }
  }

  public async findByEmail(email: string) {
    const customer = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.email, email))
      .then(res => res[0])

    return { customer }
  }

  public async findById(id: string) {
    const customer = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.id, id))
      .then(res => res[0])

    return { customer }
  }

  public async deleteCustomer(id: string) {
    const customer = await db
      .delete(customersTable)
      .where(eq(customersTable.id, id))

    return { customer }
  }

  public async findMany() {
    const customers = await db.select().from(customersTable)

    return { customers }
  }
}
