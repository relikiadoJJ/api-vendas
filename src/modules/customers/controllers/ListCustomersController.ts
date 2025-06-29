import type { FastifyReply, FastifyRequest } from 'fastify'
import { ListCustomersService } from '../services/ListCustomersService'

export async function ListCustomersController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const listCustomers = new ListCustomersService()

  const customers = await listCustomers.execute()

  return reply.status(200).send({
    customers,
  })
}
