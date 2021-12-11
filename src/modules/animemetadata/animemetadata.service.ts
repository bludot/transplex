import { Inject, Injectable } from '@nestjs/common'
import { ManticoreService } from '../manticore/manticore.service'

@Injectable()
export class AnimeMetaDataService {
  constructor(
    @Inject('MANTICORE')
    private readonly manticoreService: ManticoreService,
  ) {}

  async getAnidbMetadata(animeId: string) {
    return this.manticoreService.searchAnimeByAnidbId(animeId)
  }
}
