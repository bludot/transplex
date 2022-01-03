import { Controller, Get, Query } from '@nestjs/common'
import * as Bluebird from 'bluebird'
import { NyaapiService } from '../nyaapi/nyaapi.service'
import { TorrentParserService } from '../torrentparser/torrentparser.service'
import { UtilsService } from '../utils/utils.service'
import { SearchByUserDTO, SearchDTO } from './nyaapi-api.dto'

@Controller('/nyaapi')
export class NyaapiApiController {
  constructor(
    private readonly nyaapiService: NyaapiService,
    private readonly torrentParserService: TorrentParserService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get('/search')
  async search(@Query() search: SearchDTO): Promise<any> {
    const data = await this.nyaapiService.search(
      decodeURIComponent(search.query),
      {
        category: search.category,
        filter: search.filter,
      },
      search.n,
    )
    return Bluebird.map(
      data,
      async (item) => {
        item.torrentdata = await this.torrentParserService.parseRemoteTorrent(
          item.torrent,
        )
        if (item.torrentdata.files) {
          item.torrentdata.files = item.torrentdata.files.map((file) => ({
            ...file,
            regex: this.utilsService.parseFileName(file.name),
          }))
        }
        return item
      },
      { concurrency: 10 },
    )
  }
  @Get('/search_by_user')
  searchByUser(@Query() search: SearchByUserDTO): Promise<any> {
    return this.nyaapiService.searchByUser(
      decodeURIComponent(search.user),
      decodeURIComponent(search.query),
      {
        category: search.category,
        filter: search.filter,
      },
      search.n,
    )
  }
}
