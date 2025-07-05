import type { FastifyPluginAsync } from 'fastify'
import { rateLimiter } from './rateLimiter'

export const rateLimiterPlugin: FastifyPluginAsync = async app => {
  app.addHook('onRequest', rateLimiter)
}
