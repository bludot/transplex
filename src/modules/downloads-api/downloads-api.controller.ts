import {Body, Controller, Get, Param, Post} from '@nestjs/common'
import {AnimeMetaDataService} from '../animemetadata/animemetadata.service'
import {DownloadsService} from '../downloads/downloads.service'
import {IDownloads} from '../downloads/repository/interface'
import {FileManagerService} from '../file-manager/file-manager.service'
import {MediaService} from '../media/media.service'
import {IMedia} from '../media/repository/interface'
import {TorrentParserService} from '../torrentparser/torrentparser.service'
import {MediaType} from '../transmission/interfaces'
import {UtilsService} from '../utils/utils.service'
import {AddDownloadDto} from './downloads-api.dto'

@Controller('/downloads')
export class DownloadsApiController {
  constructor(
    private readonly downloadService: DownloadsService,
    private readonly mediaService: MediaService,
    private readonly animeMetadataService: AnimeMetaDataService,
    private readonly fileManagerService: FileManagerService,
    private readonly torrenParserService: TorrentParserService,
    private readonly utilsService: UtilsService,
  ) {
  }

  @Post('/add')
  async addDownload(@Body() body: AddDownloadDto): Promise<any> {
    const media: IMedia = await this.mediaService.getMediaByName(body.mediaName)
    const metadata = await this.animeMetadataService.getMetadata(
      media.thetvdbid,
    )
    const torrentInfo = await this.torrenParserService.parseRemoteTorrent(
      body.url,
    )
    const files = torrentInfo.files.map((file) => {
      return {
        ...file,
        name: file.path,
        ...this.utilsService.parseFileNameCTRL(
          file.path.match(/.*\/(.*)/)[1] || file.path,
          media.type as MediaType,
        ),
      }
    })
    const episodes = metadata.episodes
    await this.fileManagerService.autoCreateMap(
      files,
      episodes,
      media.id,
      media.type as MediaType,
    )
    const partial: Partial<IDownloads> = {
      mediaId: media.id,
      magnetlink: body.magnetLink,
      item: body.item,
      hash: body.hash,
    }
    return this.downloadService.addDownload(partial, media.type as MediaType)
  }

  @Get('/mediaid/:mediaid')
  async getDownloadByMediaId(@Param('mediaid') mediaId: string) {
    return this.downloadService.getDownloadByMediaId(mediaId)
  }
}
