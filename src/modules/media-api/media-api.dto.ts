import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumberString, IsString } from 'class-validator'

export class Media {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  type: string

  @ApiProperty()
  @IsBoolean()
  anime: boolean

  @ApiProperty()
  @IsBoolean()
  watch: boolean

  @ApiProperty()
  @IsNumberString()
  anidbId: string
}
