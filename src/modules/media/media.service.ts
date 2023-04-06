import { Injectable } from '@nestjs/common'
import { IMedia } from './repository/interface'
import { MediaRepository } from './repository/media.repository'

@Injectable()
export class MediaService {
  constructor(private readonly repo: MediaRepository) {}

  async getAllMedia(): Promise<IMedia[]> {
    return this.repo.findAll()
  }

  async addMedia(media: Partial<IMedia>): Promise<IMedia> {
    return this.repo.upsert({
      name: media.name,
      type: media.type,
      anime: media.anime,
      watch: media.watch,
      thetvdbid: media.thetvdbid,
    })
  }

  async getMediaByName(name: string): Promise<IMedia> {
    return this.repo.findOneByName(name)
  }

  async deleteMedia(name: string): Promise<void> {
    return this.repo.removeByName(name)
  }

  async getMediaById(id: string): Promise<IMedia> {
    return this.repo.findOneById(id)
  }

  async getMediaByTheTvDbId(thetvdbid: number): Promise<IMedia> {
    return this.repo.findOneByTheTvDbId(thetvdbid)
  }
}
