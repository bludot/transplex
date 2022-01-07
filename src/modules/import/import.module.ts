import { Module } from '@nestjs/common'
import { DownloadsModule } from '../downloads/downloads.module'
import { MediaModule } from '../media/media.module'
import { SettingsModule } from '../settings/settings.module'
import { TransmissionModule } from '../transmission/transmission.module'
import { UtilsModule } from '../utils/utils.module'
import { ImportService } from './import.service'

@Module({
  imports: [
    SettingsModule,
    TransmissionModule,
    DownloadsModule,
    UtilsModule,
    MediaModule,
  ],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
