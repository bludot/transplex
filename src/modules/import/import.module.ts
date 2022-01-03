import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { TransmissionModule } from '../transmission/transmission.module'
import { ImportConfig } from './import.config'
import { ImportService } from './import.service'

@Module({
  imports: [ConfigModule.register(ImportConfig), TransmissionModule],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
