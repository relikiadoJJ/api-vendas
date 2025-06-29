import fs from 'node:fs'
import path from 'node:path'
import uploadConfig from '@config/upload'
import { db } from '@shared/drizzle/db'
import { usersTable } from '@shared/drizzle/db/schema/users'
import { AppError } from '@shared/errors/AppError'
import { eq } from 'drizzle-orm'
import { UserRepository } from '../drizzle/repositories/UsersRepository'

interface IRequest {
  user_id: string
  avatarFilename: string
}

export class UpdateUserAvatarService {
  private userRepository = new UserRepository()

  public async execute({ user_id, avatarFilename }: IRequest) {
    const user = await this.userRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found.', 404)
    }

    if (user.avatarURL) {
      const userAvatarFilePath = path.join(
        uploadConfig.directory,
        user.avatarURL
      )

      try {
        await fs.promises.stat(userAvatarFilePath)
        await fs.promises.unlink(userAvatarFilePath)
      } catch (err) {
        console.error(err)
      }
    }

    const cleanFilename = path.basename(avatarFilename)

    await db
      .update(usersTable)
      .set({ avatarURL: cleanFilename })
      .where(eq(usersTable.id, user_id))

    return {
      ...user,
      avatarURL: cleanFilename,
      password: undefined,
      name: undefined,
      email: undefined,
    }
  }
}
