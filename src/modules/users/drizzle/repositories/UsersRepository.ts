import { db } from '@shared/drizzle/db'
import { usersTable } from '@shared/drizzle/db/schema/users'
import { usersTokenTable } from '@shared/drizzle/db/schema/usersTokens'
import { eq } from 'drizzle-orm'

export class UserRepository {
  public async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
    return user
  }

  public async findById(userId: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
    return user
  }

  public async create(data: { name: string; email: string; password: string }) {
    const [user] = await db.insert(usersTable).values(data).returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    })

    return user
  }

  public async findManyUsers() {
    return await db.select().from(usersTable)
  }

  public async findByToken(token: string) {
    const [userToken] = await db
      .select()
      .from(usersTokenTable)
      .where(eq(usersTokenTable.token, token))

    return userToken
  }

  public async updatePassword(userId: string, password: string) {
    return await db
      .update(usersTable)
      .set({ password })
      .where(eq(usersTable.id, userId))
  }

  public async deletePassword(token: string) {
    await db.delete(usersTokenTable).where(eq(usersTokenTable.token, token))
  }

  public async createToken(userId: string) {
    const [token] = await db
      .insert(usersTokenTable)
      .values({ userId })
      .returning({
        token: usersTokenTable.token,
      })

    return token
  }

  public async updateUserData(
    userId: string,
    data: Partial<typeof usersTable.$inferInsert>
  ) {
    await db.update(usersTable).set(data).where(eq(usersTable.id, userId))

    const [updatedUser] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))

    return updatedUser
  }
}
