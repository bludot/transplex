import { Module } from '@nestjs/common'
import { DownloadsModule } from '../downloads/downloads.module'
import { ImportModule } from '../import/import.module'
import { MediaModule } from '../media/media.module'
import { TransmissionModule } from '../transmission/transmission.module'
import { UtilsModule } from '../utils/utils.module'
import { EventsGateway } from './events.gateway'
import { EventsService } from './events.service'

@Module({
  imports: [
    DownloadsModule,
    MediaModule,
    TransmissionModule,
    UtilsModule,
    ImportModule,
  ],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway, EventsService],
})
export class EventsModule {}
