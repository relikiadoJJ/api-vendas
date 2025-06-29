import { UserRepository } from '../drizzle/repositories/UsersRepository'

export class ListUsersService {
  private userRepository = new UserRepository()

  public async execute() {
    const users = await this.userRepository.findManyUsers()

    const usersWithoutPassword = users.map(({ password, ...users }) => users)

    return {
      usersWithoutPassword,
    }
  }
}
