import { Controller, Get, Inject, Injectable, Query } from '@nestjs/common'
import { ManticoreService } from '../manticore/manticore.service'
import { SearchDto } from './search-api.dto'

@Injectable()
@Controller('/search')
export class SearchApiController {
  constructor(
    @Inject('MANTICORE')
    private readonly manticoreService: ManticoreService,
  ) {}
  @Get('/')
  async search(@Query() query: SearchDto): Promise<any> {
    const data = await this.manticoreService.searchSynonyms(query.query)
    return {
      ...data,
      hits: {
        ...data.hits,
        hits: data.hits.hits.slice(0, 30),
      },
    }
  }
}
