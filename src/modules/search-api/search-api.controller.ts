import { Controller, Get, Injectable, Query } from '@nestjs/common'
import { TheTvDbService } from '../thetvdb/thetvdb.service'
import { SearchDto } from './search-api.dto'

@Injectable()
@Controller('/search')
export class SearchApiController {
  constructor(private readonly theTVDBService: TheTvDbService) {}

  @Get('/')
  async searchTheTVDB(@Query() query: SearchDto): Promise<any> {
    const data = await this.theTVDBService.search(query.query)
    const parsedData = JSON.parse(JSON.stringify(data))
    return parsedData
  }
}
