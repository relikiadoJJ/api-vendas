import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { DeleteCustomerService } from '../services/DeleteCustomerService'

export async function DeleteCustomerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const customerParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = customerParamsSchema.parse(request.params)

  const deleteCustomer = new DeleteCustomerService()

  await deleteCustomer.execute({
    id,
  })

  return reply.status(204).send()
}
