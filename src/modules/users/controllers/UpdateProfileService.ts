import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UpdateProfileService } from '../services/UpdateProfileService'

export async function UpdateProfileController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userSchema = z.object({
    name: z.string().trim().min(3, 'Nome é obrigatório'),
    email: z.string().email().trim(),
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
    old_password: z.string(),
  })
  const userId = request.user.sub
  const { name, email, password, old_password } = userSchema.parse(request.body)

  const updateProfile = new UpdateProfileService()

  const user = await updateProfile.execute({
    userId,
    name,
    email,
    password,
    old_password,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password: undefined,
    },
  })
}
