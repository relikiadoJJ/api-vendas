import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UpdateCustomerService } from '../services/UpdateCustomerService'

export async function UpdateCustomerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const customerBodySchema = z.object({
    name: z
      .string()
      .min(3, 'O nome deve ter pelo menos 2 caracteres')
      .max(100, 'O nome deve ter no máximo 100 caracteres')
      .refine(val => /^[\p{L}\p{N}\s\-']+$/u.test(val), {
        message: 'Nome contém caracteres inválidos',
      }),
    email: z.string().email().trim(),
  })

  const customerParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = customerParamsSchema.parse(request.params)
  const { name, email } = customerBodySchema.parse(request.body)

  const createCustomer = new UpdateCustomerService()

  const customer = await createCustomer.execute({
    id,
    name,
    email,
  })

  return reply.status(204).send({
    customer,
  })
}
