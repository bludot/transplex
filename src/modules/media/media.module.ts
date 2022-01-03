import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImportModule } from '../import/import.module'
import { MediaService } from './media.service'
import { MediaRepository } from './repository/media.repository'

@Module({
  imports: [TypeOrmModule.forFeature([MediaRepository]), ImportModule],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
