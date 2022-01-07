import { Inject, Injectable } from '@nestjs/common'
import { ManticoreService } from '../manticore/manticore.service'
import { TheTvDbService } from '../thetvdb/thetvdb.service'
import { MediaType } from '../transmission/interfaces'
import { UtilsService } from '../utils/utils.service'

@Injectable()
export class AnimeMetaDataService {
  constructor(
    @Inject('MANTICORE')
    private readonly manticoreService: ManticoreService,
    private readonly theTvDbService: TheTvDbService,
    private readonly utilsService: UtilsService,
  ) {}

  async getAnidbMetadata(animeId: string) {
    const metadata = await this.manticoreService.searchAnimeByAnidbId(animeId)
    try {
      return {
        ...metadata,
        theTvDb: await this.theTvDbService.getMetadata(
          animeId,
          this.utilsService.convertEnum<MediaType>(metadata.type, MediaType),
        ),
      }
    } catch (e) {
      return {
        ...metadata,
        theTvDb: await this.theTvDbService.searchMetadata(
          animeId,
          metadata.title,
          this.utilsService.convertEnum<MediaType>(metadata.type, MediaType),
        ),
      }
    }
  }
  async getAnimePoster(animeId: string) {
    const metadata = await this.manticoreService.searchAnimeByAnidbId(animeId)
    return this.theTvDbService.getPoster(
      animeId,
      this.utilsService.convertEnum<MediaType>(metadata.type, MediaType),
    )
  }
  async getAnimeFanart(animeId: string) {
    const metadata = await this.manticoreService.searchAnimeByAnidbId(animeId)
    return this.theTvDbService.getFanart(
      animeId,
      this.utilsService.convertEnum<MediaType>(metadata.type, MediaType),
    )
  }
}
