import { Module } from '@nestjs/common'
import { SettingsModule } from '../settings/settings.module'
import { AnimesourcesService } from './animesources.service'

@Module({
  imports: [SettingsModule],
  providers: [AnimesourcesService],
  exports: [AnimesourcesService],
})
export class AnimesourcesModule {}
