import { db } from '@shared/drizzle/db'
import { customersTable } from '@shared/drizzle/db/schema/customers'

export class ListCustomersService {
  public async execute() {
    const customers = await db.select().from(customersTable)

    return {
      customers,
    }
  }
}
