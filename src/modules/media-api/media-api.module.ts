import { Module } from '@nestjs/common'
import { DownloadsModule } from '../downloads/downloads.module'
import { MediaModule } from '../media/media.module'
import { MediaApiController } from './media-api.controller'

@Module({
  imports: [MediaModule, DownloadsModule],
  controllers: [MediaApiController],
})
export class MediaApiModule {}
