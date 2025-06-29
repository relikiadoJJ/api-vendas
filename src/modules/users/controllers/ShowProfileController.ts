import type { FastifyReply, FastifyRequest } from 'fastify'
import { ShowProfileService } from '../services/ShowProfileService'

export async function ShowProfileController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getUserProfile = new ShowProfileService()

  const { user } = await getUserProfile.execute({
    userId: request?.user.sub,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password: undefined,
    },
  })
}
