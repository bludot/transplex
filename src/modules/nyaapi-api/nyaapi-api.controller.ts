import * as vm from 'vm'
import * as util from 'util'
import { Controller, Get, Query } from '@nestjs/common'
import * as Bluebird from 'bluebird'
import { NyaapiService } from '../nyaapi/nyaapi.service'
import { TorrentParserService } from '../torrentparser/torrentparser.service'
import { SearchByUserDTO, SearchDTO } from './nyaapi-api.dto'

function parseFileName(fileName: string): any {
  const regexes = [
    {
      regex: /(^|(.*?)[ _\.\-]*)SE?(\d{1,4})[ _\.\-]?EP?(\d{1,4})(([ _\.\-]|EP?|[ _\.\-]EP?)(\d{1,4}))?[ _\.]*(.*?)$/,
      season: 2,
      episode: 3,
    },
  ]

  function runRegex(str: string, regexObj: any): any {
    const sandbox = {
      regex: regexObj.regex,
      string: str,
      result: null,
    }

    const context = vm.createContext(sandbox)
    console.log('Sandbox initialized: ' + vm.isContext(sandbox))
    const script = new vm.Script('result = regex.exec(string);')
    try {
      // One could argue if a RegExp hasn't processed in a given time.
      // then, its likely it will take exponential time.
      script.runInContext(context, { timeout: 1000 }) // milliseconds
    } catch (e) {
      console.log('ReDos occurred', e) // Take some remedial action here...
    }

    const result = util.inspect(sandbox).split('\n')

    let startCapturing = false
    const reduced = result.reduce((acc, curr) => {
      if (curr.includes('result: [')) {
        startCapturing = true
        return acc
      }
      if (startCapturing) {
        return acc.concat(curr.trim())
      }
      return acc
    }, [])
    const groups = reduced.slice(1, reduced.length - 2)
    const data =  Object.keys(regexObj).reduce((acc, curr) => {
      if (curr === 'regex') {
        return acc
      }
      return {
        ...acc,
        [curr]: groups[regexObj[curr]],
      }
    }, {})
    console.log(data)
    return data
  }
  let i = 0
  let data = null
  console.log(fileName)
  while (i < regexes.length && !data) {
    console.log(i)
    data = runRegex(fileName, regexes[i]) || []
    if (data) {
      return data
    }
    i++
  }
  return data
}

@Controller('/nyaapi')
export class NyaapiApiController {
  constructor(
    private readonly nyaapiService: NyaapiService,
    private readonly torrentParserService: TorrentParserService,
  ) {}

  @Get('/search')
  async search(@Query() search: SearchDTO): Promise<any> {
    const data = await this.nyaapiService.search(
      decodeURIComponent(search.query),
      {
        category: search.category,
        filter: search.filter,
      },
      search.n,
    )
    return Bluebird.map(
      data,
      async (item) => {
        item.torrentdata = await this.torrentParserService.parseRemoteTorrent(
          item.torrent,
        )
        if (item.torrentdata.files) {
          item.torrentdata.files = item.torrentdata.files.map((file) => ({
            ...file,
            regex: parseFileName(file.name),
          }))
        }
        return item
      },
      { concurrency: 10 },
    )
  }
  @Get('/search_by_user')
  searchByUser(@Query() search: SearchByUserDTO): Promise<any> {
    return this.nyaapiService.searchByUser(
      decodeURIComponent(search.user),
      decodeURIComponent(search.query),
      {
        category: search.category,
        filter: search.filter,
      },
      search.n,
    )
  }
}
