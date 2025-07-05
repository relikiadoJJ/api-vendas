import { env } from '@shared/http/env'

import type { RedisOptions } from 'ioredis'

interface ICacheConfig {
  config: {
    redis: RedisOptions
  }
  driver: string
}

export default {
  config: {
    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASS || undefined,
    },
  },
  driver: 'redis',
} as ICacheConfig
