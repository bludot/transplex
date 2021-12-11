import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class SearchDto {
  @ApiProperty()
  @IsString()
  public query: string

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  public page: number
}
