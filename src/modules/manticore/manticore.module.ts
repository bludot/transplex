import { Module } from '@nestjs/common'
import { AnimesourcesModule } from '../animesources/animesources.module'
import { AnimesourcesService } from '../animesources/animesources.service'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/config.service'
import { ManticoreConfig } from './manticore.config'
import { ManticoreService } from './manticore.service'

const manticoreFactory = {
  provide: 'MANTICORE',
  imports: [ConfigModule.register(ManticoreConfig)],
  useFactory: async (
    optionsProvider: ConfigService<ManticoreConfig>,
    animeSourcesService: AnimesourcesService,
  ) => {
    const manticoreService = new ManticoreService(
      optionsProvider,
      animeSourcesService,
    )
    await manticoreService.setup()
    return manticoreService
  },
  inject: [ConfigService, AnimesourcesService],
}

@Module({
  imports: [ConfigModule.register(ManticoreConfig), AnimesourcesModule],
  providers: [manticoreFactory],
  exports: ['MANTICORE'],
})
export class ManticoreModule {}
