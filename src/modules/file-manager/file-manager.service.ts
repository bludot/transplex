import { Injectable } from '@nestjs/common'
import * as Bluebird from 'bluebird'
import { MediaType } from '../transmission/interfaces'
import { FileMapperService } from './file-mapper.service'
import { FileMapRepository } from './repository/file-map.repository'
import { FileMap } from './repository/file-map.entity'

@Injectable()
export class FileManagerService {
  constructor(
    private readonly repo: FileMapRepository,
    private readonly fileMapperService: FileMapperService,
  ) {}
  async autoCreateMap(
    files: any[],
    episodes: any[],
    mediaId: string,
    mediaType: MediaType,
  ) {
    const mappedFiles = this.fileMapperService.mapFilesToEpisodes(
      files,
      episodes,
    )
    // console.log(
    //   mappedFiles.map((file) => ({
    //     mediaId,
    //     fileName: file.fileName.match(/.*\/(.*)/)[1] || file.fileName,
    //     episodeName: file.name,
    //     episodeNumber: file.episode || '0',
    //     seasonNumber: file.season || '0',
    //     mediaType,
    //   })),
    // )
    await Bluebird.map(
      mappedFiles,
      async (file) => {
        return this.repo.upsert({
          mediaId,
          fileName: file.fileName.match(/.*\/(.*)/)[1] || file.fileName,
          episodeName: file.name,
          episodeNumber: file.episode || '0',
          seasonNumber: file.season || '0',
          mediaType,
        })
      },
      { concurrency: 1 },
    )
  }

  getMappedFiles(mediaId: string) {
    return this.repo.findByMediaId(mediaId)
  }

  addFileMapping(fileMap: Partial<FileMap>) {
    return this.repo.upsert(fileMap)
  }
}
