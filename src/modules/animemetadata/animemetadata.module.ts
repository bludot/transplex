import { Module } from '@nestjs/common'
import { ManticoreModule } from '../manticore/manticore.module'
import { TheTvDbModule } from '../thetvdb/thetvdb.module'
import { UtilsModule } from '../utils/utils.module'
import { AnimeMetaDataService } from './animemetadata.service'

@Module({
  imports: [ManticoreModule, TheTvDbModule, UtilsModule],
  providers: [AnimeMetaDataService],
  exports: [AnimeMetaDataService],
})
export class AnimeMetadataModule {}
