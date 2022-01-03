import { Body, Controller, Post } from '@nestjs/common'
import { DownloadsService } from '../downloads/downloads.service'
import { IDownloads } from '../downloads/repository/interface'
import { MediaService } from '../media/media.service'
import { IMedia } from '../media/repository/interface'
import { MediaType } from '../transmission/interfaces'
import { AddDownloadDto } from './downloads-api.dto'

@Controller('/downloads')
export class DownloadsApiController {
  constructor(
    private readonly downloadService: DownloadsService,
    private readonly mediaService: MediaService,
  ) {}

  @Post('/add')
  async addDownload(@Body() body: AddDownloadDto): Promise<any> {
    const media: IMedia = await this.mediaService.getMediaByName(body.mediaName)
    const partial: Partial<IDownloads> = {
      mediaId: media.id,
      magnetlink: body.magnetLink,
      item: body.item,
      hash: body.hash,
    }
    return this.downloadService.addDownload(partial, media.type as MediaType)
  }
}
