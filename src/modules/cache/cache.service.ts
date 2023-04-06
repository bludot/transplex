import { Injectable } from '@nestjs/common'
import { createClient, RedisClientType } from 'redis'
import type {} from 'redis'

@Injectable()
export class CacheService {
  private readonly client: RedisClientType<any>

  constructor() {
    this.client = createClient({
      url: 'redis://localhost:6379',
    })
    ;(async () => {
      this.client.on('error', (err) => console.log('Redis Client Error', err))

      await this.client.connect()
    })()
  }

  async get(key: string) {
    const value = await this.client.get(key)
    return value
  }

  async set(key: string, value: string | number | Buffer) {
    await this.client.set(key, value)
  }
}
