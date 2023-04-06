import { Controller, Get, Param, Res } from '@nestjs/common'
import { AnimeMetaDataService } from '../animemetadata/animemetadata.service'

@Controller('/metadata')
export class MetadataApiController {
  constructor(private readonly animeMetadataService: AnimeMetaDataService) {}

  @Get('/anime/:type/:id')
  getAnimeMetadata(@Param('id') id: string, @Param('type') type: string) {
    return this.animeMetadataService.getMetadata(id, type)
  }

  @Get('/anime/:type/:id/poster')
  async getAnimePosterFromTheTvDb(
    @Param('id') id: string,
    @Param('type') type: string,
    @Res() response,
  ) {
    const data = await this.animeMetadataService.getAnimePosterByTheTVDBID(
      id,
      type,
    )
    data.pipe(response)
  }

  @Get('/anime/:type/:id/fanart')
  async getAnimeFanart(
    @Param('id') id: string,
    @Param('type') type: string,
    @Res() response,
  ) {
    const data = await this.animeMetadataService.getAnimeFanart(id, type)
    return data.pipe(response)
  }
}
