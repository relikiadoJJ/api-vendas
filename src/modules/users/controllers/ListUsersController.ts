import { ListUsersService } from '../services/ListUsersService'

export async function ListUsersController() {
  const listUsersService = new ListUsersService()

  const users = await listUsersService.execute()

  return {
    users,
  }
}
