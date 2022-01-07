import { Module } from '@nestjs/common'
import { SettingsModule } from '../settings/settings.module'
import { TransmissionService } from './transmission.service'

@Module({
  imports: [SettingsModule],
  providers: [TransmissionService],
  exports: [TransmissionService],
})
export class TransmissionModule {}
