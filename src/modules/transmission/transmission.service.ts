import { Injectable } from '@nestjs/common'
import * as Transmission from 'transmission'
import { ConfigService } from '../config/config.service'
import { MediaType } from './interfaces'
import { TransmissionConfig } from './transmission.config'

@Injectable()
export class TransmissionService {
  private transmission: Transmission
  public downloadDir: string
  constructor(private readonly config: ConfigService<TransmissionConfig>) {
    this.transmission = new Transmission({
      host: config.env.TRANSMISSION_HOST,
      port: config.env.TRANSMISSION_PORT,
      username: config.env.TRANSMISSION_USERNAME,
      password: config.env.TRANSMISSION_PASSWORD,
      url: config.env.TRANSMISSION_URL,
      ssl: config.env.TRANSMISSION_SSL,
    })
    this.downloadDir = config.env.TRANSMISSION_DOWNLOADS
  }

  processDownloadDir(type: MediaType) {
    switch (type) {
      case MediaType.ANIME_SHOW:
        return 'anime'
      case MediaType.ANIME_MOVIE:
        return 'anime movies'
      case MediaType.MOVIE:
        return 'movies'
      case MediaType.TV_SHOW:
        return 'series'
      default:
        return 'movies'
    }
  }

  addMagnet(magnet: string, type: MediaType) {
    const options = {
      'download-dir': this.downloadDir, // this.processDownloadDir(type),
    }

    return new Promise((resolve, reject) => {
      this.transmission.addUrl(magnet, options, (err, ...args) => {
        if (err) return reject(err)
        console.log(args)
        resolve(args)
      })
    })
  }

  getTorrents() {
    return new Promise((resolve, reject) => {
      this.transmission.get((err, ...args) => {
        if (err) return reject(err)
        resolve(args)
      })
    })
  }

  getActiveTorrents() {
    return new Promise((resolve, reject) => {
      this.transmission.active((err, ...args) => {
        if (err) return reject(err)
        resolve(args)
      })
    })
  }
  getStatusType(type) {
    switch (type) {
      case 0:
        return 'STOPPED'
      case 1:
        return 'CHECK_WAIT'
      case 2:
        return 'CHECK'
      case 3:
        return 'DOWNLOAD_WAIT'
      case 4:
        return 'DOWNLOAD'
      case 5:
        return 'SEED_WAIT'
      case 6:
        return 'SEED'
      case 7:
        return 'ISOLATED'
      default:
        return 'UNKNOWN'
    }
  }
  async getTorrentByHash(hash: string) {
    const { torrents } = (await this.getTorrents())[0]
    return torrents.find((t) => t.hashString === hash)
  }
  transmissionDownloads() {
    return this.config.env.TRANSMISSION_DOWNLOADS
  }
}
