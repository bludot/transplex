import { Readable, Stream } from 'stream'
import { Injectable } from '@nestjs/common'
import axios from 'axios'
import * as convertXML from 'xml-js'
import { CacheService } from '../cache/cache.service'
import { MediaType } from '../transmission/interfaces'
import { ConfigService } from '../config/config.service'
import { TheTvDbClient } from './thetvdb.v4.client'
import { TheTvDbConfig } from './thetvdb.config'

function bufferToStream(buffer: Buffer): Stream {
  const stream = new Readable()
  stream.push(buffer)
  stream.push(null)
  return stream
}

@Injectable()
export class TheTvDbService {
  private anidbidToTvdbidMapping: any[]
  private readonly v4client: TheTvDbClient

  constructor(
    private readonly cacheService: CacheService,
    private readonly config: ConfigService<TheTvDbConfig>,
  ) {
    this.v4client = new TheTvDbClient(
      config.env.THETVDB_API_KEY,
      config.env.THETVDB_PIN,
    )
    axios
      .get(
        'https://raw.githubusercontent.com/Anime-Lists/anime-lists/master/anime-list-master.xml',
      )
      .then(({ data }) => {
        const json = convertXML.xml2js(data, { compact: true })
        this.anidbidToTvdbidMapping = json['anime-list'].anime.map((anime) => {
          return Object.keys(anime._attributes).reduce((acc, key) => {
            return { ...acc, [key]: anime._attributes[key] }
          }, {})
        })
        this.patch()
      })
  }

  patch() {
    const patches = [
      { anidbid: 8832, tvdbid: 1606 },
      { anidbid: 332, tvdbid: 131182 },
    ]
    patches.forEach((patch: any) => {
      this.anidbidToTvdbidMapping.find((anime) => {
        return anime.anidbid.toString() === patch.anidbid.toString()
      }).tvdbid = patch.tvdbid
    })
  }

  type(type: MediaType) {
    switch (type) {
      case MediaType.ANIME_SHOW:
        return 'series'
      case MediaType.ANIME_MOVIE:
        return 'movies'
      case MediaType.MOVIE:
        return 'movies'
      case MediaType.TV_SHOW:
        return 'series'
      default:
        return 'series'
    }
  }

  getTvdbId(anidbid: string) {
    const res = this.anidbidToTvdbidMapping.find((anime) => {
      return anime.anidbid.toString() === anidbid.toString()
    })
    return res ? res.tvdbid : null
  }

  getAnidbid(thetvdbid: string) {
    const res = this.anidbidToTvdbidMapping.find((anime) => {
      return anime.tvdbid.toString() === thetvdbid.toString()
    })
    return res ? res.tvdbid : null
  }

  async getMetadata(thetvdbid: string, type?: MediaType) {
    const cache = await this.cacheService.get(`metadata_${thetvdbid}`)

    if (!cache) {
      console.log('no cache!')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { data } = await this.v4client.getMetadata(thetvdbid, type)
      console.log('got metadata!', data)
      await this.cacheService.set(`metadata_${thetvdbid}`, JSON.stringify(data))
      return data
    }
    return JSON.parse(cache)
  }

  async getMetadataByTvDbId(tvdbid: string, mediaType: MediaType) {
    console.log('RUNNING THIS')
    const type = this.type(mediaType)
    const cache = await this.cacheService.get(`metadata_${tvdbid}`)
    if (!cache) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { data } = await this.v4client.getMetadata(tvdbid, type)
      await this.cacheService.set(`metadata_${tvdbid}`, JSON.stringify(data))
      return data
    }
    return JSON.parse(cache)
  }

  async getPosterByTheTVDBID(tvdbid: string, type: MediaType) {
    const metadata = await this.getMetadata(tvdbid, type)

    const image = metadata.data.image || metadata.data.artworks[0].image
    const cache = await this.cacheService.get(image)

    if (!cache) {
      const data = await axios.get(image, {
        responseType: 'arraybuffer',
      })

      const buffer = new Buffer(data.data)
      await this.cacheService.set(image, buffer.toString('base64'))
      return bufferToStream(buffer)
    }
    const buffer = new Buffer(cache, 'base64')
    return bufferToStream(buffer)
  }

  async getPoster(anidbid: string) {
    const metadata = await this.getMetadata(anidbid)

    const image = metadata.data.image
    const cache = await this.cacheService.get(image)

    if (!cache) {
      const data = await axios.get(image, {
        responseType: 'arraybuffer',
      })

      const buffer = new Buffer(data.data)
      await this.cacheService.set(image, buffer.toString('base64'))
      return bufferToStream(buffer)
    }
    const buffer = new Buffer(cache, 'base64')
    return bufferToStream(buffer)
  }

  async getMovieFanart(metadata: any) {
    const image = metadata.data.artworks.find((artwork) => artwork.type === 15)
      .image
    const cache = await this.cacheService.get(
      `https://artworks.thetvdb.com${image}`,
    )
    if (!cache) {
      const data = await axios.get(`https://artworks.thetvdb.com${image}`, {
        responseType: 'arraybuffer',
      })

      const buffer = new Buffer(data.data)
      await this.cacheService.set(image, buffer.toString('base64'))
      return bufferToStream(buffer)
    }
    const buffer = new Buffer(cache, 'base64')
    return bufferToStream(buffer)
  }

  async getFanart(thetvdbid: string, type: string) {
    let metadata
    try {
      metadata = await this.getMetadata(thetvdbid)
    } catch (e) {
      console.log('ERROR', e)
      metadata = await this.getMovieFanart(metadata)
    }
    const image = metadata.data.artworks.find((artwork) => artwork.type === 3)
      .image
    const cache = await this.cacheService.get(image)

    if (!cache) {
      const data = await axios.get(image, {
        responseType: 'arraybuffer',
      })

      const buffer = new Buffer(data.data)
      await this.cacheService.set(image, buffer.toString('base64'))
      return bufferToStream(buffer)
    }
    const buffer = new Buffer(cache, 'base64')
    return bufferToStream(buffer)
  }

  async getSeasons(anidbid: string) {
    const tvdbid = this.getTvdbId(anidbid)
    return this.v4client.getSeasons(tvdbid)
  }

  async searchMetadata(
    thetvdbid: string,
    query?: string,
    mediaType?: MediaType,
  ) {
    const type = this.type(mediaType).slice(0, -1)
    const cache = await this.cacheService.get(`search_${query}_${type}`)

    if (!cache) {
      const { data } = await this.v4client.searchMetadata(query, type)
      console.log(data)
      await this.cacheService.set(
        `search_${query}_${type}`,
        JSON.stringify(data),
      )
      const item = data.data.find((item) => {
        return item.genres.includes('Animation')
      })
      return this.getMetadataByTvDbId(thetvdbid, mediaType)
    }

    const cacheData = JSON.parse(cache)
    return this.getMetadataByTvDbId(thetvdbid, mediaType)
  }

  async search(query: string) {
    const {
      data: { data },
    } = await this.v4client.searchAny(query)
    return data.map((item: any) => ({
      ...item,
      anidbid: this.getAnidbid(item.id?.replace(/[^0-9.]/gm, '')),
    }))
  }
}
