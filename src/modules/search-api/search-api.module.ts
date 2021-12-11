import { Module } from '@nestjs/common'
import { ManticoreModule } from '../manticore/manticore.module'
import { SearchApiController } from './search-api.controller'

@Module({
  imports: [ManticoreModule],
  controllers: [SearchApiController],
})
export class SearchApiModule {}
