import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import * as _ from 'lodash'
import * as Bluebird from 'bluebird'
import { DownloadsService } from '../downloads/downloads.service'
import { MediaService } from '../media/media.service'
import { EventType } from '../events/event.types'
import { TransmissionService } from '../transmission/transmission.service'
import { UtilsService } from '../utils/utils.service'
import { MediaType } from '../transmission/interfaces'
import { EventsGateway } from './events.gateway'

@Injectable()
export class EventsService {
  constructor(
    private readonly downloadService: DownloadsService,
    private readonly mediaService: MediaService,
    private readonly transmissionService: TransmissionService,
    private readonly eventsGateway: EventsGateway,
    private readonly utilsService: UtilsService,
  ) {}
  @Cron(CronExpression.EVERY_5_SECONDS)
  async UpdateStatus() {
    const downloads = await this.downloadService.findAllUnfinished()
    const { torrents } = (await this.transmissionService.getActiveTorrents())[0]
    const downloadAndTorrent = downloads.map((download) => ({
      ...download,
      torrent: torrents.find(
        (torrent) => torrent.hashString === download?.hash,
      ),
    }))
    await Bluebird.map(
      downloadAndTorrent,
      async (data, i) => {
        const torrentStatus = this.transmissionService.getStatusType(
          data.torrent.status,
        )
        const media = await this.mediaService.getMediaById(data.mediaId)
        if (data.torrent.doneDate !== 0) {
          if (data.status !== 'FINISHED') {
            await this.downloadService.updateDownload({
              ..._.omit(data, ['torrent']),
              status: 'FINISHED',
            })
            await this.eventsGateway.sendEvent(
              EventType.SERIES_STATUS_CHANGED,
              {
                title: media.name,
                status: 'FINISHED',
              },
            )
            this.eventsGateway.sendEvent(EventType.SERIES_DOWNLOAD_PROGRESS, {
              ...data,
              files: data.torrent.files.map((file) => ({
                ...file,
                data: this.utilsService.parseFileNameCTRL(
                  file.name.split('/')[1],
                  media.type as MediaType,
                ),
              })),
            })
          }
          return
        }
        if (torrentStatus === 'DOWNLOAD') {
          if (data.status !== 'DOWNLOADING') {
            await this.downloadService.updateDownload({
              ..._.omit(data, ['torrent']),
              status: 'DOWNLOADING',
            })
            await this.eventsGateway.sendEvent(
              EventType.SERIES_STATUS_CHANGED,
              {
                title: media.name,
                status: 'DOWNLOADING',
              },
            )
          }
          this.eventsGateway.sendEvent(EventType.SERIES_DOWNLOAD_PROGRESS, {
            ...data,
            files: data.torrent.files.map((file) => ({
              ...file,
              data: this.utilsService.parseFileNameCTRL(
                file.name.split('/')[1],
                media.type as MediaType,
              ),
            })),
          })
          return
        }
        if (torrentStatus === 'SEED') {
          if (data.status !== 'SEEDING') {
            await this.downloadService.updateDownload({
              ..._.omit(data, ['torrent']),
              status: 'SEEDING',
            })
            await this.eventsGateway.sendEvent(
              EventType.SERIES_STATUS_CHANGED,
              {
                title: media.name,
                status: 'SEEDING',
              },
            )
          }
          return
        }
      },
      { concurrency: 100 },
    )

    // doneDate === 0
  }
}
