import type { usersTable } from '@shared/drizzle/db/schema/users'
import { AppError } from '@shared/errors/AppError'
import { hash, verify } from 'argon2'
import { UserRepository } from '../drizzle/repositories/UsersRepository'

interface IRequest {
  userId: string
  name: string
  email: string
  password?: string
  old_password?: string
}

export class UpdateProfileService {
  private userRepository = new UserRepository()

  public async execute({
    userId,
    name,
    email,
    password,
    old_password,
  }: IRequest) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new AppError('User not found.')
    }

    const userWithEmail = await this.userRepository.findByEmail(email)

    if (userWithEmail && userWithEmail.id !== userId) {
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

      const isOldPasswordValid = await verify(user.password, old_password)

      if (!isOldPasswordValid) {
        throw new AppError('Old password does not match.')
      }

      updateData.password = await hash(password)
    }

    const updatedUser = await this.userRepository.updateUserData(
      userId,
      updateData
    )

    return updatedUser
  }
}
