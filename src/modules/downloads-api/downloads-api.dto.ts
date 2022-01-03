import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class AddDownloadDto {
  @ApiProperty()
  @IsString()
  mediaName: string

  @ApiProperty()
  @IsString()
  magnetLink: string

  @ApiProperty()
  @IsString()
  hash: string

  @ApiProperty()
  @IsNumber()
  item: number
}
