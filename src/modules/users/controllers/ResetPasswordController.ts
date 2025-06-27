import { AppError } from '@shared/errors/AppError'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResetPasswordService } from '../services/ResetPasswordService'

export async function ResetPasswordController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userSchema = z.object({
    token: z.string().uuid(),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(
        /[^A-Za-z0-9]/,
        'A senha deve conter pelo menos um caractere especial'
      ),
    passwordConfirmation: z.string(),
  })

  const { token, password, passwordConfirmation } = userSchema.parse(
    request.body
  )

  const resetPassword = new ResetPasswordService()

  if (password !== passwordConfirmation) {
    throw new AppError('Credentials invalid', 409)
  }

  await resetPassword.execute({
    token,
    password,
  })

  return reply.status(204).send({ message: 'Senha redefinida com sucesso.' })
}
