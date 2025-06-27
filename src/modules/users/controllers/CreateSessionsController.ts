import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateSessionsService } from '../services/CreateSessionsService'

export async function CreateSessionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userSchema = z.object({
    email: z.string().email().trim(),
    password: z.string(),
  })

  const { email, password } = userSchema.parse(request.body)

  const createSessions = new CreateSessionsService()

  const user = await createSessions.execute({
    email,
    password,
  })

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: user.id,
      },
    }
  )

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: user.id,
        expiresIn: '7d',
      },
    }
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}
