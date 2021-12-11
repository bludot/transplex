import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { MediaType } from '../transmission/interfaces'

export class MagnetDTO {
  @ApiProperty()
  @IsString()
  readonly url: string

  @ApiProperty()
  @IsEnum(Object.values(MediaType))
  readonly media_type: MediaType
}
