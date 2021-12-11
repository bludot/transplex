import { Injectable } from '@nestjs/common'
import axios from 'axios'
import * as convertXML from 'xml-js'
import { ConfigService } from '../config/config.service'
import { AnimeSourcesConfig } from './animesources.config'

@Injectable()
export class AnimesourcesService {
  private animeListXmlSource: string
  constructor(private readonly config: ConfigService<AnimeSourcesConfig>) {
    this.animeListXmlSource = this.config.env.ANIME_LIST_XML_SOURCE
  }

  async getAnimeListXmlSource() {
    const { data } = await axios.get(this.animeListXmlSource)
    const json = convertXML.xml2js(data)
    return json
  }

  async getManamiMetadataSource() {
    const { data } = await axios.get(this.config.env.MANAMI_METADATA)
    return data
  }
}
