import { db } from '@shared/drizzle/db'
import { usersTable } from '@shared/drizzle/db/schema/users'
import { AppError } from '@shared/errors/AppError'
import { verify } from 'argon2'
import { eq } from 'drizzle-orm'

interface IRequest {
  email: string
  password: string
}

export class CreateSessionsService {
  public async execute({ email, password }: IRequest) {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))

    const user = users[0]

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401)
    }

    const passwordConfirmed = await verify(user.password, password)

    if (!passwordConfirmed) {
      throw new AppError('Incorrect email/password combination', 401)
    }

    return user
  }
}
