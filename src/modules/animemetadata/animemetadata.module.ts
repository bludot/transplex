import { Module } from '@nestjs/common'
import { TheTvDbModule } from '../thetvdb/thetvdb.module'
import { UtilsModule } from '../utils/utils.module'
import { AnimeMetaDataService } from './animemetadata.service'

@Module({
  imports: [TheTvDbModule, UtilsModule],
  providers: [AnimeMetaDataService],
  exports: [AnimeMetaDataService],
})
export class AnimeMetadataModule {}
