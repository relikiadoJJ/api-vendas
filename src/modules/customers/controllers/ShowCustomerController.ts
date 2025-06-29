import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ShowCustomerService } from '../services/ShowCustomerService'

export async function ShowCustomerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const customerParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = customerParamsSchema.parse(request.params)

  const showCustomer = new ShowCustomerService()

  const customer = await showCustomer.execute({
    id,
  })

  return reply.status(200).send({
    customer,
  })
}
