import { db } from '@shared/drizzle/db'
import { usersTable } from '@shared/drizzle/db/schema/users'
import { AppError } from '@shared/errors/AppError'
import { eq } from 'drizzle-orm'

interface IRequest {
  userId: string
}

export class ShowProfileService {
  public async execute({ userId }: IRequest) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .then(res => res[0])

    if (!user) {
      throw new AppError('User not found.')
    }

    return {
      user,
    }
  }
}
