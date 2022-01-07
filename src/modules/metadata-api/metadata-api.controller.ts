import { Controller, Get, Param, Res } from '@nestjs/common'
import { AnimeMetaDataService } from '../animemetadata/animemetadata.service'

@Controller('/metadata')
export class MetadataApiController {
  constructor(private readonly animeMetadataService: AnimeMetaDataService) {}

  @Get('/anime/:id')
  getAnimeMetadata(@Param('id') id: string) {
    return this.animeMetadataService.getAnidbMetadata(id)
  }
  @Get('/anime/:id/poster')
  async getAnimePoster(@Param('id') id: string, @Res() response) {
    const data = await this.animeMetadataService.getAnimePoster(id)
    data.pipe(response)
  }

  @Get('/anime/:id/fanart')
  async getAnimeFanart(@Param('id') id: string, @Res() response) {
    const data = await this.animeMetadataService.getAnimeFanart(id)
    return data.pipe(response)
  }
}
