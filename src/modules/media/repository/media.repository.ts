import { EntityRepository, Repository } from 'typeorm'
import * as _ from 'lodash'
import { IMedia } from './interface'
import { Media } from './media.entity'

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {
  public async findOneById(id: string): Promise<IMedia> {
    const mediaItem: Media = await this.findOne({
      where: { id },
    })

    return mediaItem
      ? {
          id: mediaItem.id,
          name: mediaItem.name,
          type: mediaItem.type,
          anime: mediaItem.anime,
          watch: mediaItem.watch,
          thetvdbid: mediaItem.thetvdbid,
          updatedAt: mediaItem.updatedAt,
        }
      : null
  }

  public async findOneByName(name: string): Promise<IMedia> {
    const mediaItem: Media = await this.findOne({
      where: { name },
    })

    return mediaItem
      ? {
          id: mediaItem.id,
          name: mediaItem.name,
          type: mediaItem.type,
          anime: mediaItem.anime,
          watch: mediaItem.watch,
          thetvdbid: mediaItem.thetvdbid,
          updatedAt: mediaItem.updatedAt,
        }
      : null
  }

  public async findAll(): Promise<IMedia[]> {
    const mediaItems: Media[] = await this.find()
    return mediaItems.map((mediaItem) => ({
      id: mediaItem.id,
      name: mediaItem.name,
      type: mediaItem.type,
      anime: mediaItem.anime,
      watch: mediaItem.watch,
      thetvdbid: mediaItem.thetvdbid,
      updatedAt: mediaItem.updatedAt,
    }))
  }

  public async upsert(body: Partial<Media>): Promise<IMedia> {
    // eslint-disable-next-line
    let nullFields: readonly string[] = Object.keys(body).reduce(
      (empty: readonly string[], key: string) =>
        body[key] === undefined ? empty.concat(key) : empty,
      [],
    )
    // eslint-disable-next-line
    let cleanBody: Media = _.omit(body, nullFields) as Media
    // eslint-disable-next-line
    let savedMediaItem: Media = await this.findOne({ name: cleanBody.name })
    if (savedMediaItem) {
      await this.update({ id: savedMediaItem.id }, cleanBody)
      const mediaItem = { ...savedMediaItem, ...cleanBody }
      return {
        id: mediaItem.id,
        name: mediaItem.name,
        type: mediaItem.type,
        anime: mediaItem.anime,
        watch: mediaItem.watch,
        thetvdbid: mediaItem.thetvdbid,
        updatedAt: mediaItem.updatedAt,
      }
    }

    // eslint-disable-next-line
    let newMediaItem: Media = this.create(cleanBody)
    const saved: Media = await this.save(newMediaItem)
    newMediaItem = null
    cleanBody = null
    nullFields = null
    savedMediaItem = null
    return {
      id: saved.id,
      name: saved.name,
      type: saved.type,
      anime: saved.anime,
      watch: saved.watch,
      thetvdbid: saved.thetvdbid,
      updatedAt: saved.updatedAt,
    }
  }

  async removeByName(name: string) {
    this.delete({ name })
  }
}
