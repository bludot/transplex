import { Expose } from 'class-transformer'
import { IsBooleanString, IsOptional, IsString } from 'class-validator'

export class SettingsConfig {
  /**
   * Transsmission
   */
  @Expose()
  @IsString()
  @IsOptional()
  readonly TRANSMISSION_HOST: string

  @Expose()
  @IsString()
  @IsOptional()
  readonly TRANSMISSION_PORT: string

  @Expose()
  @IsString()
  @IsOptional()
  readonly TRANSMISSION_USERNAME: string

  @Expose()
  @IsString()
  @IsOptional()
  readonly TRANSMISSION_PASSWORD: string

  @Expose()
  @IsString()
  @IsOptional()
  readonly TRANSMISSION_URL: string

  @Expose()
  @IsBooleanString()
  @IsOptional()
  readonly TRANSMISSION_SSL: boolean

  @Expose()
  @IsString()
  @IsOptional()
  readonly TRANSMISSION_DOWNLOADS: string

  /**
   * AnimeSources
   */
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
  readonly MANAMI_METADATA: string

  /**
   * Import
   */
  @Expose()
  @IsString()
  @IsOptional()
  readonly IMPORT_ROOT: string
}
