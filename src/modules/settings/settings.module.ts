import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '../config/config.module'
import { SettingsRepository } from './repository/settings.repository'
import { SettingsConfig } from './settings.config'
import { SettingsService } from './settings.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingsRepository]),
    ConfigModule.register(SettingsConfig),
  ],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
