import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { TransmissionConfig } from './transmission.config'
import { TransmissionService } from './transmission.service'

@Module({
  imports: [ConfigModule.register(TransmissionConfig)],
  providers: [TransmissionService],
  exports: [TransmissionService],
})
export class TransmissionModule {}
