import { Injectable } from '@nestjs/common'
import * as Transmission from 'transmission'
import { ConfigService } from '../config/config.service'
import { MediaType } from './interfaces'
import { TransmissionConfig } from './transmission.config'

@Injectable()
export class TransmissionService {
  private transmission: Transmission
  constructor(private readonly config: ConfigService<TransmissionConfig>) {
    this.transmission = new Transmission({
      host: config.env.TRANSMISSION_HOST,
      port: config.env.TRANSMISSION_PORT,
      username: config.env.TRANSMISSION_USERNAME,
      password: config.env.TRANSMISSION_PASSWORD,
      url: config.env.TRANSMISSION_URL,
      ssl: config.env.TRANSMISSION_SSL,
    })
  }

  processDownloadDir(type: MediaType) {
    switch (type) {
      case MediaType.ANIME_SHOW:
        return '/nfs/home/anime'
      case MediaType.ANIME_MOVIE:
        return '/nfs/home/anime movies'
      case MediaType.MOVIE:
        return '/nfs/home/movies'
      case MediaType.TV_SHOW:
        return '/nfs/home/series'
      default:
        return '/nfs/home/movies'
    }
  }

  addMagnet(magnet: string, type: MediaType) {
    const options = {
      'download-dir': this.processDownloadDir(type),
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
}
