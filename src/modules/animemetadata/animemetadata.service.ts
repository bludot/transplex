import { Injectable } from '@nestjs/common'
import { TheTvDbService } from '../thetvdb/thetvdb.service'
import { MediaType } from '../transmission/interfaces'
import { UtilsService } from '../utils/utils.service'

@Injectable()
export class AnimeMetaDataService {
  constructor(
    private readonly theTvDbService: TheTvDbService,
    private readonly utilsService: UtilsService,
  ) {}

  async getMetadata(thtvdbid: string, type?: string): Promise<any> {
    const data = await this.theTvDbService.getMetadata(
      thtvdbid,
      this.utilsService.convertEnum(type, MediaType),
    )
    return {
      ...data.data,
      type: type,
    }
  }

  async getAnimePosterByTheTVDBID(theTVDBID: string, type: string) {
    return this.theTvDbService.getPosterByTheTVDBID(
      theTVDBID,
      this.utilsService.convertEnum(type, MediaType),
    )
  }

  async getAnimeFanart(thtvdbid: string, type: string) {
    return this.theTvDbService.getFanart(thtvdbid, type)
  }
}
