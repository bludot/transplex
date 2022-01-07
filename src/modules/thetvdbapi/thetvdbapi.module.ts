import { Module } from '@nestjs/common'
import { TheTvDbModule } from '../thetvdb/thetvdb.module'
import { TheTvDbApiController } from './thetvdbapi.controller'

@Module({
  imports: [TheTvDbModule],
  controllers: [TheTvDbApiController],
})
export class TheTvDbApiModule {}
