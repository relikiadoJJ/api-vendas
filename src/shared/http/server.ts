import path from 'node:path'
import uploadConfig from '@config/upload'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { AppError } from '@shared/errors/AppError'
import fastify from 'fastify'
import { secureHeadersPlugin } from 'src/@plugin/SecurityHeaders'
import { ZodError } from 'zod'
import { env } from './env'
import { RoutesIndex } from './routes'

const app = fastify()

app.register(secureHeadersPlugin)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.setErrorHandler((error, _, reply) => {
  console.log(error)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message })
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  return reply.status(500).send({
    message: 'Internal server error.',
  })
})

app.register(fastifyMultipart)

app.register(fastifyStatic, {
  root: path.resolve(uploadConfig.directory),
  prefix: '/files',
})
app.register(RoutesIndex)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running port 3333')
  })
