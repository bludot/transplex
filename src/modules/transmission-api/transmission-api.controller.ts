import {Body, Controller, Get, Param, Post} from '@nestjs/common'
import { TransmissionService } from '../transmission/transmission.service'
import { MagnetDTO } from './transmission-api.dto'

@Controller()
export class TransmissionController {
  constructor(private readonly transmissionService: TransmissionService) {}

  @Post('/magnet')
  getHello(@Body() body: MagnetDTO): Promise<any> {
    return this.transmissionService.addMagnet(body.url, body.media_type)
  }

  @Get('/torrents')
  getTorrents(): Promise<any> {
    return this.transmissionService.getTorrents()
  }

  @Get('/torrents/:hash')
  getTorrent(@Param('hash') hash: string): Promise<any> {
    return this.transmissionService.getTorrentByHash(hash)
  }

  @Get('/torrents/active')
  getActiveTorrents(): Promise<any> {
    return this.transmissionService.getActiveTorrents()
  }
}
