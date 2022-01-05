import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { DownloadsModule } from '../downloads/downloads.module'
import { MediaModule } from '../media/media.module'
import { TransmissionModule } from '../transmission/transmission.module'
import { UtilsModule } from '../utils/utils.module'
import { ImportConfig } from './import.config'
import { ImportService } from './import.service'

@Module({
  imports: [
    ConfigModule.register(ImportConfig),
    TransmissionModule,
    DownloadsModule,
    UtilsModule,
    MediaModule,
  ],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
