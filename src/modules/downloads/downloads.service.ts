import { Injectable } from '@nestjs/common'
import { MediaType } from '../transmission/interfaces'
import { TransmissionService } from '../transmission/transmission.service'
import { UtilsService } from '../utils/utils.service'
import { DownloadsRepository } from './repository/downloads.repository'
import { IDownloads } from './repository/interface'

@Injectable()
export class DownloadsService {
  constructor(
    private readonly repo: DownloadsRepository,
    private readonly transmissionService: TransmissionService,
    private readonly utilsService: UtilsService,
  ) {}

  async addDownload(download: Partial<IDownloads>, mediaType: MediaType) {
    const res = await this.transmissionService.addMagnet(
      download.magnetlink,
      mediaType,
    )
    this.repo.upsert(download)
  }

  async downloadStatusByMediaId(mediaId: string, type: MediaType) {
    const download = await this.repo.findOne({ mediaId })
    const { torrents } = (await this.transmissionService.getTorrents())[0]
    const torrent = torrents.find(
      (torrent) => torrent.hashString === download?.hash,
    )
    if (torrent) {
      torrent.files = torrent.files.map((file) => ({
        ...file,
        data: this.utilsService.parseFileNameCTRL(
          file.name.match(/.*\/(.*)/)[1] || file.name,
          type,
        ),
      }))
    }
    return (
      {
        ...torrent,
        status: download?.status,
      } || {
        status: download?.status || 'UNKNOWN',
      }
    )
  }
  findAllUnfinished() {
    return this.repo.findAllUnfinished()
  }
  updateDownload(download: Partial<IDownloads>) {
    return this.repo.upsert(download)
  }
  async getDownloadByMediaId(mediaId: string) {
    return this.repo.findOne({ mediaId })
  }
}
