import { Module } from '@nestjs/common'
import { DownloadsModule } from '../downloads/downloads.module'
import { ImportModule } from '../import/import.module'
import { MediaModule } from '../media/media.module'
import { MediaApiController } from './media-api.controller'

@Module({
  imports: [MediaModule, DownloadsModule, ImportModule],
  controllers: [MediaApiController],
})
export class MediaApiModule {}
