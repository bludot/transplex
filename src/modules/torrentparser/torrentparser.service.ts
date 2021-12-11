import { Injectable } from '@nestjs/common'
import * as torrentParser from 'parse-torrent'

@Injectable()
export class TorrentParserService {
  async parseRemoteTorrent(url: string): Promise<any> {
    console.log(torrentParser)
    return new Promise((resolve) => {
      torrentParser.remote(url, (err, parsedTorrent) => {
        if (err) {
          console.log(err)
          resolve({})
        } else {
          resolve({
            files: parsedTorrent.files,
          })
        }
      })
    })
  }
}
