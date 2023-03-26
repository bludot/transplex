import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common'
import { DownloadsService } from '../downloads/downloads.service'
import { ImportService } from '../import/import.service'
import { MediaService } from '../media/media.service'
import { MediaType } from '../transmission/interfaces'
import { Media } from './media-api.dto'

@Controller('/media')
export class MediaApiController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly downloadService: DownloadsService,
    private readonly importService: ImportService,
  ) {}

  @Get('/')
  async getAllMedia() {
    return this.mediaService.getAllMedia()
  }

  @Put('/')
  async addMedia(@Body() media: Media) {
    console.log(media)
    return this.mediaService.addMedia({
      name: media.name,
      type: media.type,
      anime: media.anime,
      watch: media.watch,
      thetvdbid: media.thetvdbid,
    })
  }

  @Get('/:name')
  async getMedia(@Param('name') name: string) {
    const media = await this.mediaService.getMediaByName(
      decodeURIComponent(name),
    )
    return {
      ...media,
      files: await this.importService.getLocalFiles(decodeURIComponent(name)),
      status: await this.downloadService.downloadStatusByMediaId(
        media.id,
        media.type as MediaType,
      ),
    }
  }

  @Delete('/:name')
  async deleteMedia(@Param('name') name: string) {
    return this.mediaService.deleteMedia(decodeURIComponent(name))
  }
}
