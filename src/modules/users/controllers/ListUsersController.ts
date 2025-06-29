import type { FastifyReply, FastifyRequest } from 'fastify'
import { ListUsersService } from '../services/ListUsersService'

export async function ListUsersController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const listUsersService = new ListUsersService()

  const users = await listUsersService.execute()

  return reply.status(200).send({
    users,
  })
}
