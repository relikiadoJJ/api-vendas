import { db } from '@shared/drizzle/db'
import { usersTable } from '@shared/drizzle/db/schema/users'
import { AppError } from '@shared/errors/AppError'
import { hash } from 'argon2'
import { eq } from 'drizzle-orm'

interface IRequest {
  name: string
  email: string
  password: string
}

export class CreateUserService {
  public async execute({ name, email, password }: IRequest) {
    const emailExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .then(res => res[0])

    if (emailExists) {
      throw new AppError('Email address already user.', 409)
    }

    const passwordHash = await hash(password)

    const user = await db
      .insert(usersTable)
      .values({ name, email, password: passwordHash })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      })
      .then(res => res[0])

    return user
  }
}
