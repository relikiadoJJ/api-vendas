import { db } from '@shared/drizzle/db'
import { usersTable } from '@shared/drizzle/db/schema/users'
import { AppError } from '@shared/errors/AppError'
import { hash, verify } from 'argon2'
import { eq } from 'drizzle-orm'

interface IRequest {
  userId: string
  name: string
  email: string
  password?: string
  old_password?: string
}

export class UpdateProfileService {
  public async execute({
    userId,
    name,
    email,
    password,
    old_password,
  }: IRequest) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .then(res => res[0])

    if (!user) {
      throw new AppError('User not found.')
    }

    const userUpdateEmail = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .then(res => res[0])

    if (userUpdateEmail && userUpdateEmail.id !== userId) {
      throw new AppError('There is already one user with this email')
    }

    const updateData: Partial<typeof usersTable.$inferInsert> = {
      name,
      email,
    }

    if (password) {
      if (!old_password) {
        throw new AppError('Old password is required.')
      }

      const checkOldPassword = await verify(user.password, old_password)

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.')
      }

      updateData.password = await hash(password)
    }

    await db.update(usersTable).set(updateData).where(eq(usersTable.id, userId))

    const updatedUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .then(res => res[0])

    return updatedUser
  }
}
