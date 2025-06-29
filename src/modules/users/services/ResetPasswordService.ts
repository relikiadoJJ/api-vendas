import { AppError } from '@shared/errors/AppError'
import { hash } from 'argon2'
import { addHours, isAfter } from 'date-fns'
import { UserRepository } from '../drizzle/repositories/UsersRepository'

interface IRequest {
  token: string
  password: string
}

export class ResetPasswordService {
  private userRepository = new UserRepository()

  public async execute({ token, password }: IRequest) {
    const userToken = await this.userRepository.findByToken(token)

    if (!userToken) {
      throw new AppError('Token do usuário não existe.')
    }

    const user = await this.userRepository.findById(userToken.id)

    if (!user) {
      throw new AppError('Usuário não existe.')
    }

    const tokenCreatedAt = userToken.createdAt
    const compareDate = addHours(tokenCreatedAt, 2)

    if (isAfter(new Date(), compareDate)) {
      throw new AppError('Token expirado.')
    }

    const hashedPassword = await hash(password)

    await this.userRepository.updatePassword(user.id, hashedPassword)

    await this.userRepository.deletePassword(token)

    return user
  }
}
