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
          name: watchitem.name,
          query: watchitem.query,
          user: watchitem.user,
          items: watchitem.items,
          completed: watchitem.completed,
          type: watchitem.type,
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
          name: watchitem.name,
          query: watchitem.query,
          user: watchitem.user,
          items: watchitem.items,
          completed: watchitem.completed,
          type: watchitem.type,
          updatedAt: watchitem.updatedAt,
        }
      : null
  }

  public async findAll(): Promise<IWatchlist[]> {
    const watchitems: Watchlist[] = await this.find()
    return watchitems.map((watchitem) => ({
      id: watchitem.id,
      name: watchitem.name,
      query: watchitem.query,
      user: watchitem.user,
      items: watchitem.items,
      completed: watchitem.completed,
      type: watchitem.type,
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
      name: watchitem.name,
      query: watchitem.query,
      user: watchitem.user,
      items: watchitem.items,
      completed: watchitem.completed,
      type: watchitem.type,
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
    let savedWatchitem: Watchlist = await this.findOne({ query: cleanBody.query, name: cleanBody.name })
    if (savedWatchitem) {
      await this.update({ id: savedWatchitem.id }, cleanBody)
      const watchitem = { ...savedWatchitem, ...cleanBody }
      return {
        id: watchitem.id,
        name: watchitem.name,
        query: watchitem.query,
        user: watchitem.user,
        items: watchitem.items,
        completed: watchitem.completed,
        type: watchitem.type,
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
      name: saved.name,
      query: saved.query,
      user: saved.user,
      items: saved.items,
      completed: saved.completed,
      type: saved.type,
      updatedAt: saved.updatedAt,
    }
  }
}
