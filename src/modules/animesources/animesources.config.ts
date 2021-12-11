import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class AnimeSourcesConfig {
  @Expose()
  @IsString()
  readonly ANIME_LIST_XML_SOURCE: string

  @Expose()
  @IsString()
  readonly ANIMEDB_API: string

  @Expose()
  @IsString()
  readonly MANAMI_METADATA: string
}
