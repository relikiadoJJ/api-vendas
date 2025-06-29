import type { FastifyReply } from 'fastify'
import { ListUsersService } from '../services/ListUsersService'

export async function ListUsersController(reply: FastifyReply) {
  const listUsersService = new ListUsersService()

  const users = await listUsersService.execute()

  return reply.status(200).send({
    users,
  })
}
