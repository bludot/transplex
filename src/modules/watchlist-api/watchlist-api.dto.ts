import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsString } from 'class-validator'
import { MediaType } from '../transmission/interfaces'

export class AddToWatchlistDto {
  @ApiProperty()
  @IsString()
  readonly mediaId: string

  @ApiProperty()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsString()
  readonly query: string

  @ApiProperty()
  @IsString()
  readonly user: string

  @ApiProperty()
  @IsEnum(Object.values(MediaType))
  readonly type: MediaType

  @ApiProperty()
  @IsNumber()
  readonly items: number
}
