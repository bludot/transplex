import { EntityRepository, Repository } from 'typeorm'
import * as _ from 'lodash'
import { IFileMap } from './interface'
import { FileMap } from './file-map.entity'

@EntityRepository(FileMap)
export class FileMapRepository extends Repository<FileMap> {
  public async findOneById(id: string): Promise<IFileMap> {
    const filemapItem: FileMap = await this.findOne({
      where: { id },
    })

    return filemapItem
      ? {
          id: filemapItem.id,
          mediaId: filemapItem.mediaId,
          fileName: filemapItem.fileName,
          episodeName: filemapItem.episodeName,
          episodeNumber: filemapItem.episodeNumber,
          seasonNumber: filemapItem.seasonNumber,
          mediaType: filemapItem.mediaType,
          updatedAt: filemapItem.updatedAt,
        }
      : null
  }

  public async findOneByName(name: string): Promise<IFileMap> {
    const filemapItem: FileMap = await this.findOne({
      where: { name },
    })

    return filemapItem
      ? {
          id: filemapItem.id,
          mediaId: filemapItem.mediaId,
          fileName: filemapItem.fileName,
          episodeName: filemapItem.episodeName,
          episodeNumber: filemapItem.episodeNumber,
          seasonNumber: filemapItem.seasonNumber,
          mediaType: filemapItem.mediaType,
          updatedAt: filemapItem.updatedAt,
        }
      : null
  }

  public async findAll(): Promise<IFileMap[]> {
    const filemapItems: FileMap[] = await this.find()
    return filemapItems.map((filemapItem) => ({
      id: filemapItem.id,
      mediaId: filemapItem.mediaId,
      fileName: filemapItem.fileName,
      episodeName: filemapItem.episodeName,
      episodeNumber: filemapItem.episodeNumber,
      seasonNumber: filemapItem.seasonNumber,
      mediaType: filemapItem.mediaType,
      updatedAt: filemapItem.updatedAt,
    }))
  }

  public async upsert(body: Partial<FileMap>): Promise<IFileMap> {
    // eslint-disable-next-line
    let nullFields: readonly string[] = Object.keys(body).reduce(
      (empty: readonly string[], key: string) =>
        body[key] === undefined ? empty.concat(key) : empty,
      [],
    )
    // eslint-disable-next-line
    let cleanBody: FileMap = _.omit(body, nullFields) as FileMap
    // eslint-disable-next-line
    let savedFilemapItem: FileMap = await this.findOne({
      mediaId: cleanBody.mediaId,
      fileName: cleanBody.fileName,
    })
    if (savedFilemapItem) {
      await this.update({ id: savedFilemapItem.id }, cleanBody)
      const filemapItem = { ...savedFilemapItem, ...cleanBody }
      return {
        id: filemapItem.id,
        mediaId: filemapItem.mediaId,
        fileName: filemapItem.fileName,
        episodeName: filemapItem.episodeName,
        episodeNumber: filemapItem.episodeNumber,
        seasonNumber: filemapItem.seasonNumber,
        mediaType: filemapItem.mediaType,
        updatedAt: filemapItem.updatedAt,
      }
    }

    // eslint-disable-next-line
    let newFilemapItem: FileMap = this.create(cleanBody)
    const saved: FileMap = await this.save(newFilemapItem)
    newFilemapItem = null
    cleanBody = null
    nullFields = null
    savedFilemapItem = null
    return {
      id: saved.id,
      mediaId: saved.mediaId,
      fileName: saved.fileName,
      episodeName: saved.episodeName,
      episodeNumber: saved.episodeNumber,
      seasonNumber: saved.seasonNumber,
      mediaType: saved.mediaType,
      updatedAt: saved.updatedAt,
    }
  }
}
