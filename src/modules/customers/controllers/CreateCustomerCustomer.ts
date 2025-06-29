import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateCustomerService } from '../services/CreateCustomerService'

export async function CreateCustomerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userSchema = z.object({
    name: z.string().trim().min(3, 'Nome é obrigatório'),
    email: z.string().email().trim(),
  })

  const { name, email } = userSchema.parse(request.body)

  const createCustomer = new CreateCustomerService()

  const customer = await createCustomer.execute({
    name,
    email,
  })

  return reply.status(201).send({
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
    },
  })
}
