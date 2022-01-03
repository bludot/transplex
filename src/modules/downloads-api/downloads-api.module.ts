import { Module } from '@nestjs/common'
import { DownloadsModule } from '../downloads/downloads.module'
import { MediaModule } from '../media/media.module'
import { DownloadsApiController } from './downloads-api.controller'

@Module({
  imports: [DownloadsModule, MediaModule],
  controllers: [DownloadsApiController],
  providers: [],
})
export class DownloadsApiModule {}
