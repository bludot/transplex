import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MediaService } from './media.service'
import { MediaRepository } from './repository/media.repository'

@Module({
  imports: [TypeOrmModule.forFeature([MediaRepository])],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
