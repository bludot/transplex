import { Module } from '@nestjs/common'
import { CacheModule } from '../cache/cache.module'
import { ConfigModule } from '../config/config.module'
import { TheTvDbConfig } from './thetvdb.config'
import { TheTvDbService } from './thetvdb.service'

@Module({
  imports: [ConfigModule.register(TheTvDbConfig), CacheModule],
  providers: [TheTvDbService],
  exports: [TheTvDbService],
})
export class TheTvDbModule {}
