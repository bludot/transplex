import * as vm from 'vm'
import * as util from 'util'
import { Injectable } from '@nestjs/common'
import { filenameParse } from '../../../video-filename-parser/src/index'
import { MediaType } from '../transmission/interfaces'

@Injectable()
export class UtilsService {
  parseAsSeason(type: MediaType) {
    switch (type) {
      case MediaType.ANIME_SHOW:
        return true
      case MediaType.ANIME_MOVIE:
        return false
      case MediaType.MOVIE:
        return false
      case MediaType.TV_SHOW:
        return true
      case MediaType.TV:
        return true
      default:
        return false
    }
  }
  parseFileNameCTRL(fileName: string, mediaType: MediaType): any {
    try {
      const parsedData = filenameParse(
        fileName,
        this.parseAsSeason(mediaType),
      ) as any
      if (
        !parsedData.seasons &&
        !parsedData.episodeNumber &&
        parsedData.title === ''
      ) {
        return filenameParse(fileName, !this.parseAsSeason(mediaType)) as any
      }
      return {
        ...parsedData,
        episode: parsedData.episodeNumbers
          ? parsedData.episodeNumbers[0]
          : null,
        season: parsedData.seasons ? parsedData.seasons[0] : null,
      }
    } catch (e) {
      return {
        title: fileName.split('.')[0],
      }
    }
  }
  parseFileName(fileName: string): any {
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
      const data = Object.keys(regexObj).reduce((acc, curr) => {
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
  interpolate(str: string, params: any) {
    const names = Object.keys(params)
    const vals = Object.values(params)
    return new Function(...names, `return \`${str}\`;`)(...vals)
  }
  convertEnum<T>(type: any, t: any): T {
    return t[Object.keys(t).find((key) => t[key] === type)]
  }
}
