import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class TheTvDbConfig {
  @Expose()
  @IsString()
  readonly THETVDB_API_KEY: string

  @Expose()
  @IsString()
  readonly THETVDB_PIN: string
}
