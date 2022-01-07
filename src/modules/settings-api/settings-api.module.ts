import { Module } from '@nestjs/common'
import { SettingsModule } from '../settings/settings.module'
import { SettingsApiController } from './settings-api.controller'

@Module({
  imports: [SettingsModule],
  controllers: [SettingsApiController],
})
export class SettingsApiModule {}
