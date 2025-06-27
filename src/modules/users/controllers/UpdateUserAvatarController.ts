import type { FastifyRequest } from 'fastify'
import { UpdateUserAvatarService } from '../services/UpdateUserAvatarService'

export async function UpdateUserAvatarController(request: FastifyRequest) {
  const { user, file } = request as FastifyRequest & {
    user: { sub: string }
    file: { filename: string }
  }

  const updateAvatar = new UpdateUserAvatarService()

  const updatedUser = await updateAvatar.execute({
    user_id: user.sub,
    avatarFilename: file.filename,
  })

  return { user: updatedUser }
}
