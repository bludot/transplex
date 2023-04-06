import { Injectable } from '@nestjs/common'
import { isNull } from 'lodash'
import { si, pantsu } from 'nyaapi'

@Injectable()
export class NyaapiService {
  private si: si
  private pantsu: pantsu
  constructor() {
    this.si = si
    this.pantsu = pantsu
    this.si.config.updateBaseUrl('https://nyaa.si')
    this.pantsu.config.updateBaseUrl('https://nyaa.si')
  }

  async search(
    query: string,
    opts: {
      category?: string
      filter?: string
    },
    n?: number,
  ) {

    return this.si
      .search(query, n, { ...opts, sort: 'seeders', direction: 'desc' })
      .then((res) => {
        return res
      })
      .catch((err) => {
        console.log(err)
      })
  }

  matchEpisode(name: string): number {
    const regex = /\s-\s(\d{1,3})/gm
    const str = name
    let m
    let episode = 0

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, _) => {
        episode = parseInt(match)
      })
    }
    return episode
  }

  matchSeasonAndEpisode(name: string): { season: number; episode: number } {
    const regex = /S(\d{1,3})E(\d{1,3}?)/gm
    const str = `Komi.Cant.Communicate.S01E09.Its.Just.a.Country.Kid.Plus.More.1080p.NF.WEB-DL.DDP2.0.x264-NanDesuKa.mkv`
    let m
    const data = []

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, _) => {
        data.push(match)
        // console.log(`Found match, group ${groupIndex}: ${match}`)
      })
    }
    return { season: data[1], episode: data[2] }
  }
  async searchByUser(
    user: string,
    query: string,
    opts: {
      category?: string
      filter?: string
    },
    n?: number,
  ): Promise<any[]> {
    const result = await this.si.searchByUser(user, query, n, {
      ...opts,
      sort: 'seeders',
      direction: 'desc',
    })
    return result.map((item) => ({
      ...item,
      episode:
        this.matchEpisode(item.name) ||
        this.matchSeasonAndEpisode(item.name).episode,
    }))
  }
}
