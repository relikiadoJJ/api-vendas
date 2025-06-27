import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { SendForgotPasswordEmailService } from '../services/SendForgotPasswordEmailService'

export async function SendForgotPasswordController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userSchema = z.object({
    email: z.string().email().trim(),
  })

  const { email } = userSchema.parse(request.body)

  const createToken = new SendForgotPasswordEmailService()

  await createToken.execute({
    email,
  })

  return reply.status(204).send()
}
