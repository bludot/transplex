import { Module } from '@nestjs/common'
import { TheTvDbModule } from '../thetvdb/thetvdb.module'
import { SearchApiController } from './search-api.controller'

@Module({
  imports: [TheTvDbModule],
  controllers: [SearchApiController],
})
export class SearchApiModule {}
