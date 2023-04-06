import { Module } from '@nestjs/common'
import { FileManagerModule } from '../file-manager/file-manager.module'
import { FileManagerApiController } from './file-manager-api.controller'

@Module({
  imports: [FileManagerModule],
  controllers: [FileManagerApiController],
})
export class FileManagerApiModule {}
