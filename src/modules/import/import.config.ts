import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class ImportConfig {
  @Expose()
  @IsString()
  readonly IMPORT_ROOT: string
}
