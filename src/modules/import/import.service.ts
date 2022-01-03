import * as fs from 'fs'
import { resolve } from 'path'
import { readdir } from 'fs/promises'
import { Injectable } from '@nestjs/common'
import { TransmissionService } from '../transmission/transmission.service'
import { ConfigService } from '../config/config.service'
import { ImportConfig } from './import.config'

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
    private readonly config: ConfigService<ImportConfig>,
    private readonly transmissionService: TransmissionService,
  ) {}

  async getLocalFiles(location: string): Promise<string[]> {
    const dir = `${this.config.env.IMPORT_ROOT}/${location}`
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
}
