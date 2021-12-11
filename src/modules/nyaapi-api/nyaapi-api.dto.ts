import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator'

export class SearchDTO {
  @ApiProperty()
  @IsString()
  readonly query: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly category?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly filter?: string

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  readonly n?: number
}

export class SearchByUserDTO {
  @ApiProperty()
  @IsString()
  readonly query: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly category?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly filter?: string

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  readonly n?: number

  @ApiProperty()
  @IsString()
  readonly user: string
}
