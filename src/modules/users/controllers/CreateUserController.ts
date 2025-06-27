import type { FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateUserService } from '../services/CreateUserService'

export async function CreateUserController(request: FastifyRequest) {
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
  })

  const { name, email, password } = userSchema.parse(request.body)

  const createUser = new CreateUserService()

  const user = await createUser.execute({
    name,
    email,
    password,
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
}
