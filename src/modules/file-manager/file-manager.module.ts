import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileManagerService } from './file-manager.service'
import { FileMapperService } from './file-mapper.service'
import { FileMapRepository } from './repository/file-map.repository'

@Module({
  imports: [TypeOrmModule.forFeature([FileMapRepository])],
  providers: [FileManagerService, FileMapperService],
  exports: [FileManagerService],
})
export class FileManagerModule {}
