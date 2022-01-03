import { EntityRepository, Not, Repository } from 'typeorm'
import * as _ from 'lodash'
import { IDownloads } from './interface'
import { Downloads } from './downloads.entity'

@EntityRepository(Downloads)
export class DownloadsRepository extends Repository<Downloads> {
  public async findOneById(id: string): Promise<IDownloads> {
    const downloadsItem: Downloads = await this.findOne({
      where: { id },
    })

    return downloadsItem
      ? {
          id: downloadsItem.id,
          mediaId: downloadsItem.mediaId,
          item: downloadsItem.item,
          watchlistId: downloadsItem.watchlistId,
          status: downloadsItem.status,
          data: downloadsItem.data,
          added: downloadsItem.added,
          magnetlink: downloadsItem.magnetlink,
          hash: downloadsItem.hash,
          completed: downloadsItem.completed,
          updatedAt: downloadsItem.updatedAt,
        }
      : null
  }

  public async findOneByName(name: string): Promise<IDownloads> {
    const downloadsItem: Downloads = await this.findOne({
      where: { name },
    })

    return downloadsItem
      ? {
          id: downloadsItem.id,
          mediaId: downloadsItem.mediaId,
          item: downloadsItem.item,
          watchlistId: downloadsItem.watchlistId,
          status: downloadsItem.status,
          data: downloadsItem.data,
          added: downloadsItem.added,
          magnetlink: downloadsItem.magnetlink,
          hash: downloadsItem.hash,
          completed: downloadsItem.completed,
          updatedAt: downloadsItem.updatedAt,
        }
      : null
  }

  public async findAllUnfinished(): Promise<IDownloads[]> {
    const downloads = await this.find({
      where: {
        status: Not('FINISHED'),
      },
    })
    return downloads.map((downloadsItem) => ({
      id: downloadsItem.id,
      mediaId: downloadsItem.mediaId,
      item: downloadsItem.item,
      watchlistId: downloadsItem.watchlistId,
      status: downloadsItem.status,
      data: downloadsItem.data,
      added: downloadsItem.added,
      magnetlink: downloadsItem.magnetlink,
      hash: downloadsItem.hash,
      completed: downloadsItem.completed,
      updatedAt: downloadsItem.updatedAt,
    }))
  }

  public async findAll(): Promise<IDownloads[]> {
    const downloadsItems: Downloads[] = await this.find()
    return downloadsItems.map((downloadsItem) => ({
      id: downloadsItem.id,
      mediaId: downloadsItem.mediaId,
      item: downloadsItem.item,
      watchlistId: downloadsItem.watchlistId,
      status: downloadsItem.status,
      data: downloadsItem.data,
      added: downloadsItem.added,
      magnetlink: downloadsItem.magnetlink,
      hash: downloadsItem.hash,
      completed: downloadsItem.completed,
      updatedAt: downloadsItem.updatedAt,
    }))
  }

  public async upsert(body: Partial<Downloads>): Promise<IDownloads> {
    // eslint-disable-next-line
    let nullFields: readonly string[] = Object.keys(body).reduce(
      (empty: readonly string[], key: string) =>
        body[key] === undefined ? empty.concat(key) : empty,
      [],
    )
    // eslint-disable-next-line
    let cleanBody: Downloads = _.omit(body, nullFields) as Downloads
    // eslint-disable-next-line
    let savedDownloadsItem: Downloads = await this.findOne({
      mediaId: cleanBody.mediaId,
    })
    if (savedDownloadsItem) {
      await this.update({ id: savedDownloadsItem.id }, cleanBody)
      const downloadsItem = { ...savedDownloadsItem, ...cleanBody }
      return {
        id: downloadsItem.id,
        mediaId: downloadsItem.mediaId,
        item: downloadsItem.item,
        watchlistId: downloadsItem.watchlistId,
        status: downloadsItem.status,
        data: downloadsItem.data,
        added: downloadsItem.added,
        magnetlink: downloadsItem.magnetlink,
        hash: downloadsItem.hash,
        completed: downloadsItem.completed,
        updatedAt: downloadsItem.updatedAt,
      }
    }

    // eslint-disable-next-line
    let newDownloadsItem: Downloads = this.create(cleanBody)
    const saved: Downloads = await this.save(newDownloadsItem)
    newDownloadsItem = null
    cleanBody = null
    nullFields = null
    savedDownloadsItem = null
    return {
      id: saved.id,
      mediaId: saved.mediaId,
      item: saved.item,
      watchlistId: saved.watchlistId,
      status: saved.status,
      data: saved.data,
      added: saved.added,
      magnetlink: saved.magnetlink,
      hash: saved.hash,
      completed: saved.completed,
      updatedAt: saved.updatedAt,
    }
  }
}
