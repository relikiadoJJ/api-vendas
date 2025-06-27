import nodemailer from 'nodemailer'

interface ISendMail {
  to: string
  body: string
}

export class EtherealMail {
  public async sendMail({ to, body }: ISendMail): Promise<void> {
    const account = await nodemailer.createTestAccount()

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
      from: 'suport@apivendas.com',
      to,
      subject: 'Recuperacao de senha',
      text: body,
    })

    console.log('Message sent: %s', message.messageId)
    console.log('Previw URL: %s', nodemailer.getTestMessageUrl(message))
  }
}
