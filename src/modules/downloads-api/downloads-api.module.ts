import { Module } from '@nestjs/common'
import { AnimeMetadataModule } from '../animemetadata/animemetadata.module'
import { DownloadsModule } from '../downloads/downloads.module'
import { FileManagerModule } from '../file-manager/file-manager.module'
import { MediaModule } from '../media/media.module'
import { TorrentParserModule } from '../torrentparser/torrentparser.module'
import { UtilsModule } from '../utils/utils.module'
import { DownloadsApiController } from './downloads-api.controller'

@Module({
  imports: [
    DownloadsModule,
    MediaModule,
    AnimeMetadataModule,
    FileManagerModule,
    TorrentParserModule,
    UtilsModule,
  ],
  controllers: [DownloadsApiController],
  providers: [],
})
export class DownloadsApiModule {}
