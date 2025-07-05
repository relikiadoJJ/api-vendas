import { AppError } from '@shared/errors/AppError'
import type { FastifyReply, FastifyRequest } from 'fastify'
import Redis from 'ioredis'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import { env } from '../env'

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASS,
})

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 10,
  duration: 1,
})

export async function rateLimiter(
  request: FastifyRequest,
  _reply: FastifyReply
) {
  try {
    await limiter.consume(request.ip)
    return
  } catch (err) {
    throw new AppError(`Too many requests. ${err}`, 429)
  }
}
