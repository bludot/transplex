import { Controller, Get, Param } from '@nestjs/common'
import { AnimeMetaDataService } from '../animemetadata/animemetadata.service'

@Controller('/metadata')
export class MetadataApiController {
  constructor(private readonly animeMetadataService: AnimeMetaDataService) {}

  @Get('/anime/:id')
  getAnimeMetadata(@Param('id') id: string) {
    return this.animeMetadataService.getAnidbMetadata(id)
  }
}
