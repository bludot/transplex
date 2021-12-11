import { Module } from '@nestjs/common'
import { ManticoreModule } from '../manticore/manticore.module'
import { AnimeMetaDataService } from './animemetadata.service'

@Module({
  imports: [ManticoreModule],
  providers: [AnimeMetaDataService],
  exports: [AnimeMetaDataService],
})
export class AnimeMetadataModule {}
