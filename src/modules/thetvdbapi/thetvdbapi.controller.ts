import { Controller, Get, Param } from '@nestjs/common'
import { TheTvDbService } from '../thetvdb/thetvdb.service'

@Controller('/thetvdbapi')
export class TheTvDbApiController {
  constructor(private readonly theTvdbService: TheTvDbService) {}

  @Get('/seasons/:id')
  async getSeasons(@Param('id') id: string) {
    return this.theTvdbService.getSeasons(id)
  }
}
