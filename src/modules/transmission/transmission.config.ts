import { Expose } from 'class-transformer'
import { IsBooleanString, IsString } from 'class-validator'

export class TransmissionConfig {
  @Expose()
  @IsString()
  readonly TRANSMISSION_HOST: string

  @Expose()
  @IsString()
  readonly TRANSMISSION_PORT: string

  @Expose()
  @IsString()
  readonly TRANSMISSION_USERNAME: string

  @Expose()
  @IsString()
  readonly TRANSMISSION_PASSWORD: string

  @Expose()
  @IsString()
  readonly TRANSMISSION_URL: string

  @Expose()
  @IsBooleanString()
  readonly TRANSMISSION_SSL: boolean
}
