import cacheConfig from '@config/cache'

import Redis, { type Redis as RedisClient } from 'ioredis'

export class RedisCache {
  private client: RedisClient

  constructor() {
    this.client = new Redis(cacheConfig.config.redis)
  }

  public async save(key: string, value: unknown) {
    await this.client.set(key, JSON.stringify(value))
  }

  public async recover(key: string) {
    const data = await this.client.get(key)

    if (!data) {
      return null
    }

    const parsedData = JSON.parse(data)

    return parsedData
  }

  public async invalidate(key: string) {
    await this.client.del(key)
  }
}
