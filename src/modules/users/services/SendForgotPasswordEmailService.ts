import path from 'node:path'
import { EtherealMail } from '@config/email/EtherealMain'
import { AppError } from '@shared/errors/AppError'
import { UserRepository } from '../drizzle/repositories/UsersRepository'

interface IRequest {
  email: string
}

export class SendForgotPasswordEmailService {
  private userRepository = new UserRepository()

  public async execute({ email }: IRequest) {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AppError('User does not exists.')
    }

    const insertedToken = await this.userRepository.createToken(user.id)

    if (!insertedToken?.token) {
      throw new AppError('Falha ao gerar token de recuperação.')
    }

    const token = insertedToken.token

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'ForgotPassword.hbs'
    )

    const mailProvider = new EtherealMail()

    await mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name ?? 'Usuario',
          link: `http://localhost:3333/reset_password?token=${token}`,
        },
      },
    })
  }
}
