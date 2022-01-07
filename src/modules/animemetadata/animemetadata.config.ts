import { Expose } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class AnimeMetadataConfig {
  @Expose()
  @IsString()
  @IsOptional()
  readonly ANIME_LIST_XML_SOURCE: string

  @Expose()
  @IsString()
  @IsOptional()
  readonly ANIMEDB_API: string

  @Expose()
  @IsString()
  @IsOptional()
  readonly MANAMI_METADATA: string
}
