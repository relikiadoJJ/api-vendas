import { AppError } from '@shared/errors/AppError'
import { verify } from 'argon2'
import { UserRepository } from '../drizzle/repositories/UsersRepository'

interface IRequest {
  email: string
  password: string
}

export class CreateSessionsService {
  private userRepository = new UserRepository()

  public async execute({ email, password }: IRequest) {
    const user = await this.userRepository.findByEmail(email)

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
