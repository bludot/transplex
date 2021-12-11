import { Module } from '@nestjs/common'
import { NyaapiModule } from '../nyaapi/nyaapi.module'
import { TorrentParserModule } from '../torrentparser/torrentparser.module'
import { NyaapiApiController } from './nyaapi-api.controller'

@Module({
  imports: [NyaapiModule, TorrentParserModule],
  controllers: [NyaapiApiController],
})
export class NyaapiApiModule {}
