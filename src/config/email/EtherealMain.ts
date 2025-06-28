import nodemailer from 'nodemailer'
import {
  handlebarsMailTemplate,
  type IParseMailTemplate,
} from './HandlebarsMailTemplate'

interface IMailContact {
  name: string
  email: string
}

interface ISendMail {
  to: IMailContact
  from?: IMailContact
  subject: string
  templateData: IParseMailTemplate
}

export class EtherealMail {
  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMail): Promise<void> {
    const account = await nodemailer.createTestAccount()

    const mailTemplate = new handlebarsMailTemplate()

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    })

    const message = await transporter.sendMail({
      from: {
        name: from?.name || 'Suporte API Vendas',
        address: from?.email || 'suport@apivendas.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await mailTemplate.parse(templateData),
    })

    console.log('Message sent: %s', message.messageId)
    console.log('Previw URL: %s', nodemailer.getTestMessageUrl(message))
  }
}
