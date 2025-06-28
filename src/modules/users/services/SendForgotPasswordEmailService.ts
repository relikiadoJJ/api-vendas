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

    const insertedToken = await db
      .insert(usersTokenTable)
      .values({ userId: user.id })
      .returning({
        token: usersTokenTable.token,
      })
      .then(res => res[0])

    if (!insertedToken?.token) {
      throw new AppError('Falha ao gerar token de recuperação.')
    }

    const token = insertedToken.token

    const mailProvider = new EtherealMail()

    await mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de senha',
      templateData: {
        template: `Olá {{name}}: {{token}}`,
        variables: {
          name: user.name ?? 'Usuario',
          token,
        },
      },
    })
  }
}
