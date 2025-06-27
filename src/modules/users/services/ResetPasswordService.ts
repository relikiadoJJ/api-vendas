import { db } from '@shared/drizzle/db'
import { usersTable } from '@shared/drizzle/db/schema/users'
import { usersTokenTable } from '@shared/drizzle/db/schema/usersTokens'
import { AppError } from '@shared/errors/AppError'
import { hash } from 'argon2'
import { addHours, isAfter } from 'date-fns'
import { eq } from 'drizzle-orm'

interface IRequest {
  token: string
  password: string
}

export class ResetPasswordService {
  public async execute({ token, password }: IRequest) {
    const userToken = await db
      .select()
      .from(usersTokenTable)
      .where(eq(usersTokenTable.token, token))
      .then(res => res[0])

    if (!userToken) {
      throw new AppError('Token do usuário não existe.')
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userToken.userId))
      .then(res => res[0])

    if (!user) {
      throw new AppError('Usuário não existe.')
    }

    const tokenCreatedAt = userToken.createdAt
    const compareDate = addHours(tokenCreatedAt, 2)

    if (isAfter(new Date(), compareDate)) {
      throw new AppError('Token expirado.')
    }

    const hashedPassword = await hash(password)

    await db
      .update(usersTable)
      .set({ password: hashedPassword })
      .where(eq(usersTable.id, user.id))

    await db.delete(usersTokenTable).where(eq(usersTokenTable.token, token))

    return user
  }
}
