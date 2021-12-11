import { Module } from '@nestjs/common'
import { TorrentParserService } from './torrentparser.service'

@Module({
  imports: [],
  providers: [TorrentParserService],
  exports: [TorrentParserService],
})
export class TorrentParserModule {}
