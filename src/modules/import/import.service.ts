import * as fs from 'fs'
import { resolve } from 'path'
import { readdir } from 'fs/promises'
import { promisify } from 'util'
import { Injectable } from '@nestjs/common'
import * as Bluebird from 'bluebird'
import { TransmissionService } from '../transmission/transmission.service'
import { DownloadsService } from '../downloads/downloads.service'
import { UtilsService } from '../utils/utils.service'
import { MediaType } from '../transmission/interfaces'
import { MediaService } from '../media/media.service'
import { SettingsService } from '../settings/settings.service'

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

@Injectable()
export class ImportService {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly transmissionService: TransmissionService,
    private readonly downloadService: DownloadsService,
    private readonly utilsService: UtilsService,
    private readonly mediaService: MediaService,
  ) {}

  async getLocalFiles(location: string): Promise<string[]> {
    const dir = `${this.settingsService.getSettingSync(
      'IMPORT_ROOT',
    )}/${location}`
    if (!fs.existsSync(dir)) {
      return []
    }
    // eslint-disable-next-line prefer-const
    let files: string[] = []
    for await (const f of getFiles(dir)) {
      files.push(f)
    }
    return files
  }

  processImportDir(type: MediaType) {
    switch (type) {
      case MediaType.ANIME_SHOW:
        return 'anime'
      case MediaType.ANIME_MOVIE:
        return 'anime movies'
      case MediaType.MOVIE:
        return 'movies'
      case MediaType.TV_SHOW:
        return 'tv'
      default:
        return 'movies'
    }
  }

  translateFileName(fileName: string, fileData: any) {
    if (!fileData.seasons && !fileData.episodeNumbers) {
      throw new Error('invalid file name, cannot import')
    }
    const ext = fileName.split('.').pop()
    const season = fileData.seasons[0] || 1
    return `${fileData.title} - S${season}E${fileData.episodeNumbers[0]}.${ext}`
  }

  makeDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  async importDownload(mediaId: string): Promise<any> {
    const media = await this.mediaService.getMediaById(mediaId)
    const download = await this.downloadService.getDownloadByMediaId(mediaId)
    if (!download) {
      throw new Error(`Media with id ${mediaId} not found`)
    }
    const torrent = await this.transmissionService.getTorrentByHash(
      download.hash,
    )
    if (!torrent) {
      throw new Error(`Torrent with hash ${download.hash} not found`)
    }
    const files = torrent.files.map((file) => ({
      ...file,
      data: this.utilsService.parseFileNameCTRL(
        file.name.split('/')[1],
        media.type as MediaType,
      ),
    }))
    const transmissionDownloads = await this.transmissionService.transmissionDownloads()
    this.makeDirectory(
      `${this.settingsService.getSettingSync(
        'IMPORT_ROOT',
      )}/${this.processImportDir(media.type as MediaType)}/${media.name}`,
    )
    await Bluebird.map(
      files,
      async (file) => {
        try {
          const fileName = this.translateFileName(file.name, file.data)
          return promisify(fs.copyFile)(
            `${transmissionDownloads}/complete/${file.name}`,
            `${this.settingsService.getSettingSync(
              'IMPORT_ROOT',
            )}/${this.processImportDir(media.type as MediaType)}/${
              media.name
            }/${fileName}`,
          )
        } catch (err) {
          console.error(err)
          return Promise.resolve()
        }
      },
      { concurrency: 1 },
    )

    return {
      torrent,
      files,
    }
  }
}
