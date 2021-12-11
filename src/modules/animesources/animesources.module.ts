import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { AnimeSourcesConfig } from './animesources.config'
import { AnimesourcesService } from './animesources.service'

@Module({
  imports: [ConfigModule.register(AnimeSourcesConfig)],
  providers: [AnimesourcesService],
  exports: [AnimesourcesService],
})
export class AnimesourcesModule {}
