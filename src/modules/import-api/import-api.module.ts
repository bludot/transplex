import { Module } from '@nestjs/common'
import { ImportModule } from '../import/import.module'
import { ImportApiController } from './import-api.controller'

@Module({
  imports: [ImportModule],
  controllers: [ImportApiController],
})
export class ImportApiModule {}
