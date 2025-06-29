import { AppError } from '@shared/errors/AppError'
import { UserRepository } from '../drizzle/repositories/UsersRepository'

interface IRequest {
  userId: string
}

export class ShowProfileService {
  private userRepository = new UserRepository()

  public async execute({ userId }: IRequest) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new AppError('User not found.')
    }

    return {
      user,
    }
  }
}
