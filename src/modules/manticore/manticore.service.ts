import { Injectable } from '@nestjs/common'
import * as Manticoresearch from 'manticoresearch'
import * as Bluebird from 'bluebird'
import { uniqWith } from 'lodash'
import { ConfigService } from '../config/config.service'
import { AnimesourcesService } from '../animesources/animesources.service'
import { AnimeTitle } from './interfaces'
import { ManticoreConfig } from './manticore.config'

@Injectable()
export class ManticoreService {
  private client: Manticoresearch
  private indexApi: Manticoresearch.IndexApi
  private searchApi: Manticoresearch.SearchApi
  private utilsApi: Manticoresearch.UtilsApi
  constructor(
    private readonly optionsProvider: ConfigService<ManticoreConfig>,
    private readonly animeSourcesService: AnimesourcesService,
  ) {
    console.log(this.optionsProvider)
    this.client = new Manticoresearch.ApiClient()
    this.client.basePath = 'http://manticore:9308'
    this.indexApi = new Manticoresearch.IndexApi(this.client)
    this.searchApi = new Manticoresearch.SearchApi(this.client)
    this.utilsApi = new Manticoresearch.UtilsApi(this.client)
  }

  async setup() {
    const res = await this.utilsApi.sql('mode=raw&query=SHOW TABLES')
    console.log('INDESX: ', JSON.stringify(res, null, 2))
    if (res.data.map((data) => data.Index).includes('animetitle')) {
      return
    }
    await this.utilsApi.sql('mode=raw&query=DROP TABLE anime')
    await this.utilsApi.sql('mode=raw&query=DROP TABLE animetitle')
    await this.utilsApi.sql('mode=raw&query=DROP TABLE synonyms')

    // if (res.)

    await this.utilsApi.sql(
      "mode=raw&query=create table animetitle(title text, anidbid text, defaulttvdbseason string, episodeoffset string, tmdbid string, imdbid text, synonyms json) morphology='stem_en' min_infix_len = '3'",
    )
    await this.utilsApi.sql(
      "mode=raw&query=create table synonyms(title text, anidbid text, thumbnail text) morphology='stem_en' min_infix_len = '3'",
    )
    await this.utilsApi.sql(
      "mode=raw&query=create table anime(title text, year string, relations text, picture string, thumbnail string, anidbid text, description text, synonyms json, type text, tags text, episodes integer) morphology='stem_en' min_infix_len = '3'",
    )

    await this.importAnimeList()
    await this.importAnimeMetadata()
  }

  async addAnimeTitle(animeTitle: AnimeTitle) {
    try {
      await this.indexApi.insert({
        index: 'animetitle',
        doc: {
          ...animeTitle,
          anidbid: String(animeTitle.anidbid),
          defaulttvdbseason: animeTitle.defaulttvdbseason || 0,
          episodeoffset: animeTitle.episodeoffset || 0,
          tmdbid: animeTitle.tmdbid || '0',
          imdbid: animeTitle.imdbid || '',
        },
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async importAnimeList() {
    const xml = await this.animeSourcesService.getAnimeListXmlSource()
    const animeList = xml.elements[0].elements
    console.log('updating animelist')
    await Bluebird.map(
      animeList,
      (anime, i) => {
        console.log(`${i}/${animeList.length}`)
        // eslint-disable-next-line
        // @ts-ignore
        return this.addAnimeTitle({
          title: anime.elements[0].elements[0].text,
          anidbid: parseInt(anime.attributes.anidbid),
          defaulttvdbseason: parseInt(anime.attributes.defaulttvdbseason, 10),
          episodeoffset: parseInt(anime.attributes.episodeoffset, 10),
          tmdbid: parseInt(anime.attributes.tmdbid, 10),
          imdbid: anime.attributes.imdbid,
        })
      },
      { concurrency: 100 },
    ),
      console.log('done updating animelist')
  }
  async importAnimeMetadata() {
    console.log('downloading offline-db')
    const animeMetadata = await this.animeSourcesService.getManamiMetadataSource()
    console.log('starting')
    await Bluebird.map(
      animeMetadata.data,
      async (anime, i) => {
        const anidbSource = anime.sources.find((source) =>
          source.includes('https://anidb.net/anime/'),
        )
        const relationsanidb = anime.relations.filter((source) =>
          source.includes('https://anidb.net/anime/'),
        )
        console.log(`${i}/${animeMetadata.data.length}`)
        await this.indexApi.insert({
          index: 'anime',
          doc: {
            title: anime.title,
            episodes: anime.episodes,
            tags: anime.tags.join(','),
            synonyms: JSON.stringify(anime.synonyms),
            type: anime.type,
            anidbid: anidbSource?.split('/').slice(-1)[0],
            picture: anime.picture,
            thumbnail: anime.thumbnail,
            year: anime.animeSeason?.year?.toString() || '',
            relations: relationsanidb
              .map((source) => source.split('/').slice(-1)[0])
              .join(','),
          },
        })

        if (!anidbSource) {
          return
        }
        const anidbid = String(anidbSource.split('/').slice(-1)[0])
        const res = await this.searchApi.search({
          index: 'animetitle',
          query: { match: { anidbid: anidbid } },
          highlight: {
            fields: ['title'],
          },
        })
        if (!res.hits || !res.hits.hits) {
          return
        }

        if (String(res.hits.hits[0]._source.anidbid) === anidbid) {
          await this.indexApi.replace({
            index: 'animetitle',
            id: res.hits.hits[0]._id,
            doc: {
              ...res.hits.hits[0]._source,
              synonyms: JSON.stringify(anime.synonyms),
            },
          })
        }
        try {
          await Promise.all(
            anime.synonyms.map((title) =>
              this.indexApi.insert({
                index: 'synonyms',
                doc: {
                  title,
                  anidbid,
                  thumbnail: anime.thumbnail,
                },
              }),
            ),
          )
        } catch (e) {
          console.log(e)
        }
      },
      { concurrency: 50 },
    )
    console.log('done')
  }
  async searchAnimeTitle(title: string) {
    return this.searchApi.search({
      index: 'animetitle',
      query: {
        query_string: `@(title,synonyms) ^"${title}"*`,
      },
      highlight: {
        fields: ['title'],
      },
    })
  }
  async searchAnimeByAnidbId(anidbid: string) {
    const initial = (
      await this.searchApi.search({
        index: 'anime',
        query: { match: { anidbid } },
      })
    ).hits.hits[0]._source
    const others = await Promise.all(
      initial.relations.split(',').map((relation) =>
        this.searchApi.search({
          index: 'anime',
          query: { match: { anidbid: relation } },
          highlights: {
            fields: ['title'],
          },
        }),
      ),
    )
    const compact = others.map((other: any) => other.hits.hits[0]._source)
    const seasons = compact.reduce((acc, anime) => {
      if (anime.type === 'TV' && anime.title.includes(initial.title)) {
        return acc.concat(anime)
      }
      return acc
    }, [])
    return {
      ...initial,
      seasons: seasons.length + 1,
    }
  }
  async searchSynonyms(query: string) {
    const result = await this.searchApi.search({
      index: 'synonyms',
      query: {
        query_string: `@title ${query}*`,
      },
      highlight: {
        fields: ['title'],
      },
      sort: ['_score', 'id'],
    })
    return {
      ...result,
      hits: {
        ...result.hits,
        hits: uniqWith(
          result.hits.hits,
          (a: any, b: any) => a._source.anidbid === b._source.anidbid,
        ),
      },
    }
  }
}
