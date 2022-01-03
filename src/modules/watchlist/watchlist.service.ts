import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { NyaapiService } from '../nyaapi/nyaapi.service'
import { MediaType } from '../transmission/interfaces'
import { TransmissionService } from '../transmission/transmission.service'
import { IWatchlist } from './repository/interface'
import { WatchlistRepository } from './repository/watchlist.repository'

@Injectable()
export class WatchlistService {
  constructor(
    private readonly repo: WatchlistRepository,
    private readonly nyaapiService: NyaapiService,
    private readonly transmissionService: TransmissionService,
  ) {}

  async getByName(name: string) {
    return this.repo.findOneByName(name)
  }

  async getById(id: string) {
    return this.repo.findOneById(id)
  }

  async upsert(data: Partial<IWatchlist>) {
    return this.repo.upsert(data)
  }

  async addWatchList(
    mediaId: string,
    name: string,
    query: string,
    user: string,
    items: number,
    type: MediaType,
  ) {
    console.log(name, query, user, items, type)
    const watchitem = await this.upsert({
      indexData: {
        name,
        query,
        user,
        type,
      },
      items: items || 0,

      completed: false,
    })
    await this.updateWatchlist()
    return watchitem
  }

  getWatchlists() {
    return this.repo.findAll()
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async updateWatchlist() {
    const watchlists = await this.repo.findAllIncomplete()
    for (const watchlist of watchlists) {
      const {
        id,
        indexData: { name, query, user },
        items,
      } = watchlist
      const searchResults = await this.nyaapiService.searchByUser(
        user,
        query,
        {
          category: null,
          filter: null,
        },
        50,
      )
      const torrents = await this.transmissionService.getTorrents()

      const mergedTorrentAndSearch = searchResults.reduce((acc, result) => {
        const { id, name, magnet, hash } = result
        const torrent = torrents[0].torrents.find((t) => t.hashString === hash)
        if (torrent) {
          return acc
        }
        return acc.concat({
          id,
          name,
          magnet,
        })
      }, [])
      if (mergedTorrentAndSearch.length === 0) {
        await this.upsert({
          id,
          indexData: {
            name,
            query,
            user,
          },
          items,
          completed: true,
          updatedAt: new Date(),
        })
      }
      console.log(mergedTorrentAndSearch.length, items)
      if (mergedTorrentAndSearch.length > 0) {
        Promise.all(
          mergedTorrentAndSearch.map((item) => {
            this.transmissionService.addMagnet(
              item.magnet,
              watchlist.indexData.type as MediaType,
            )
          }),
        )
      }
    }
  }
}
