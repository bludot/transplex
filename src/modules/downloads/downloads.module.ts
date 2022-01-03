import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransmissionModule } from '../transmission/transmission.module'
import { UtilsModule } from '../utils/utils.module'
import { DownloadsService } from './downloads.service'
import { DownloadsRepository } from './repository/downloads.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([DownloadsRepository]),
    TransmissionModule,
    UtilsModule,
  ],
  providers: [DownloadsService],
  exports: [DownloadsService],
})
export class DownloadsModule {}
