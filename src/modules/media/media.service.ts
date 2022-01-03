import { Injectable } from '@nestjs/common'
import { ImportService } from '../import/import.service'
import { IMedia } from './repository/interface'
import { MediaRepository } from './repository/media.repository'

@Injectable()
export class MediaService {
  constructor(
    private readonly repo: MediaRepository,
    private readonly importService: ImportService,
  ) {}

  async getAllMedia(): Promise<IMedia[]> {
    return this.repo.findAll()
  }

  async addMedia(media: Partial<IMedia>): Promise<IMedia> {
    return this.repo.upsert({
      name: media.name,
      type: media.type,
      anime: media.anime,
      watch: media.watch,
      anidbId: media.anidbId,
    })
  }

  async getMediaByName(name: string): Promise<IMedia> {
    return this.repo.findOneByName(name)
  }

  async deleteMedia(name: string): Promise<void> {
    return this.repo.removeByName(name)
  }

  async getCurrentFiles(name: string): Promise<string[]> {
    return this.importService.getLocalFiles(name)
  }
  async getMediaById(id: string): Promise<IMedia> {
    return this.repo.findOneById(id)
  }
}
