import { EtherealMail } from '@config/email/EtherealMain'
import { db } from '@shared/drizzle/db'
import { usersTable } from '@shared/drizzle/db/schema/users'
import { usersTokenTable } from '@shared/drizzle/db/schema/usersTokens'
import { AppError } from '@shared/errors/AppError'
import { eq } from 'drizzle-orm'

interface IRequest {
  email: string
}

export class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .then(res => res[0])

    if (!user) {
      throw new AppError('User does not exists.')
    }

    const token = await db
      .insert(usersTokenTable)
      .values({ userId: user.id })
      .returning({
        token: usersTokenTable.token,
      })
      .then(res => res[0])

    // console.log(token)

    const mailProvider = new EtherealMail()

    await mailProvider.sendMail({
      to: user.email,
      body: `Seu token de recuperação: ${token.token}`,
    })
  }
}
