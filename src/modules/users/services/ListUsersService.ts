import { db } from '@shared/drizzle/db'
import { usersTable } from '@shared/drizzle/db/schema/users'

export class ListUsersService {
  public async execute() {
    const users = await db.select().from(usersTable)

    const usersWithoutPassword = users.map(({ password, ...users }) => users)

    return {
      usersWithoutPassword,
    }
  }
}
