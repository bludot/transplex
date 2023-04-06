import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class FileMapDTO {
  @ApiProperty()
  @IsString()
  mediaId: string

  @ApiProperty()
  @IsString()
  fileName: string

  @ApiProperty()
  @IsString()
  episodeName: string

  @ApiProperty()
  @IsNumber()
  episodeNumber: number

  @ApiProperty()
  @IsNumber()
  seasonNumber: number

  @ApiProperty()
  @IsString()
  mediaType: string
}
