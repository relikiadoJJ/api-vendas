import { AppError } from '@shared/errors/AppError'
import { hash } from 'argon2'
import { UserRepository } from '../drizzle/repositories/UsersRepository'

interface IRequest {
  name: string
  email: string
  password: string
}

export class CreateUserService {
  private userRepository = new UserRepository()

  public async execute({ name, email, password }: IRequest) {
    const emailExists = await this.userRepository.findByEmail(email)

    if (emailExists) {
      throw new AppError('Email address already user.', 409)
    }

    const passwordHash = await hash(password)

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
    })

    return user
  }
}
