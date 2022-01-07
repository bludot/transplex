import { Injectable } from '@nestjs/common'
import axios from 'axios'
import * as convertXML from 'xml-js'
import { SettingsService } from '../settings/settings.service'

@Injectable()
export class AnimesourcesService {
  private animeListXmlSource: string
  constructor(private readonly settingsService: SettingsService) {
    settingsService.getSettings().then((settings) => {
      this.animeListXmlSource = settings.ANIME_LIST_XML_SOURCE
    })
  }

  async getAnimeListXmlSource() {
    const { data } = await axios.get(this.animeListXmlSource)
    const json = convertXML.xml2js(data)
    return json
  }

  async getManamiMetadataSource() {
    const { data } = await axios.get(
      this.settingsService.getSettingSync('MANAMI_METADATA'),
    )
    return data
  }
}
