import { Module } from '@nestjs/common'
import { TransmissionModule } from '../transmission/transmission.module'
import { TransmissionController } from './transmission-api.controller'

@Module({
  imports: [TransmissionModule],
  controllers: [TransmissionController],
})
export class TransmissionAPIModule {}
