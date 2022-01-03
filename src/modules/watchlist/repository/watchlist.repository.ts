import { EntityRepository, Repository } from 'typeorm'
import * as _ from 'lodash'
import { IWatchlist } from './interface'
import { Watchlist } from './watchlist.entity'

@EntityRepository(Watchlist)
export class WatchlistRepository extends Repository<Watchlist> {
  public async findOneById(id: string): Promise<IWatchlist> {
    const watchitem: Watchlist = await this.findOne({
      where: { id },
    })

    return watchitem
      ? {
          id: watchitem.id,
          mediaId: watchitem.mediaId,
          indexData: watchitem.indexData,
          lastRun: watchitem.lastRun,
          timesRan: watchitem.timesRan,
          items: watchitem.items,
          completed: watchitem.completed,
          updatedAt: watchitem.updatedAt,
        }
      : null
  }

  public async findOneByName(name: string): Promise<IWatchlist> {
    const watchitem: Watchlist = await this.findOne({
      where: { name },
    })

    return watchitem
      ? {
          id: watchitem.id,
          mediaId: watchitem.mediaId,
          indexData: watchitem.indexData,
          lastRun: watchitem.lastRun,
          timesRan: watchitem.timesRan,
          items: watchitem.items,
          completed: watchitem.completed,
          updatedAt: watchitem.updatedAt,
        }
      : null
  }

  public async findAll(): Promise<IWatchlist[]> {
    const watchitems: Watchlist[] = await this.find()
    return watchitems.map((watchitem) => ({
      id: watchitem.id,
      mediaId: watchitem.mediaId,
      indexData: watchitem.indexData,
      lastRun: watchitem.lastRun,
      timesRan: watchitem.timesRan,
      items: watchitem.items,
      completed: watchitem.completed,
      updatedAt: watchitem.updatedAt,
    }))
  }

  public async findAllIncomplete(): Promise<IWatchlist[]> {
    const watchitems: Watchlist[] = await this.find({
      where: {
        completed: false,
      },
    })
    return watchitems.map((watchitem) => ({
      id: watchitem.id,
      mediaId: watchitem.mediaId,
      indexData: watchitem.indexData,
      lastRun: watchitem.lastRun,
      timesRan: watchitem.timesRan,
      items: watchitem.items,
      completed: watchitem.completed,
      updatedAt: watchitem.updatedAt,
    }))
  }

  public async upsert(body: Partial<Watchlist>): Promise<IWatchlist> {
    // eslint-disable-next-line
    let nullFields: readonly string[] = Object.keys(body).reduce(
      (empty: readonly string[], key: string) =>
        body[key] === undefined ? empty.concat(key) : empty,
      [],
    )
    // eslint-disable-next-line
    let cleanBody: Watchlist = _.omit(body, nullFields) as Watchlist
    // eslint-disable-next-line
    let savedWatchitem: Watchlist = await this.findOne({ mediaId: cleanBody.mediaId })
    if (savedWatchitem) {
      await this.update({ id: savedWatchitem.id }, cleanBody)
      const watchitem = { ...savedWatchitem, ...cleanBody }
      return {
        id: watchitem.id,
        mediaId: watchitem.mediaId,
        indexData: watchitem.indexData,
        lastRun: watchitem.lastRun,
        timesRan: watchitem.timesRan,
        items: watchitem.items,
        completed: watchitem.completed,
        updatedAt: watchitem.updatedAt,
      }
    }

    // eslint-disable-next-line
    let newWatchitem: Watchlist = this.create(cleanBody)
    const saved: Watchlist = await this.save(newWatchitem)
    newWatchitem = null
    cleanBody = null
    nullFields = null
    savedWatchitem = null
    return {
      id: saved.id,
      mediaId: saved.mediaId,
      indexData: saved.indexData,
      lastRun: saved.lastRun,
      timesRan: saved.timesRan,
      items: saved.items,
      completed: saved.completed,
      updatedAt: saved.updatedAt,
    }
  }
}
