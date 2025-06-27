import helmet from '@fastify/helmet'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

export const secureHeadersPlugin = fp(async (app: FastifyInstance) => {
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
})
