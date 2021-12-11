import { Module } from '@nestjs/common'
import { AnimeMetadataModule } from '../animemetadata/animemetadata.module'
import { MetadataApiController } from './metadata-api.controller'

@Module({
  imports: [AnimeMetadataModule],
  controllers: [MetadataApiController],
})
export class MetadataApiModule {}
