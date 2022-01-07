import { Injectable } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { ISettings } from './repository/interface'
import { SettingsRepository } from './repository/settings.repository'
import { SettingsConfig } from './settings.config'

@Injectable()
export class SettingsService {
  private readonly settings: any = {}
  constructor(
    private readonly repo: SettingsRepository,
    private readonly config: ConfigService<SettingsConfig>,
  ) {
    Promise.all(
      Object.keys(config.env).map((key) => {
        return this.repo.upsert({
          name: key,
          value: config.env[key],
        })
      }),
    ).then(() => {
      this.syncSettings()
    })
  }
  async getSettings(): Promise<any> {
    return (await this.repo.findAll()).reduce(
      (acc, setting) => ({
        ...acc,
        [setting.name]: setting.value,
      }),
      {} as any,
    )
  }
  async setSettigns(settings: Partial<ISettings>) {
    await this.repo.upsert(settings)
    this.syncSettings()
  }
  async getSetting(name: string): Promise<any> {
    return (await this.repo.findOneByName(name)).value
  }
  getSettingSync(name: string): any {
    return this.settings[name]
  }

  async syncSettings(): Promise<any> {
    return this.repo.findAll().then((settings) => {
      settings.forEach((setting) => {
        this.settings[setting.name] = setting.value
      })
    })
  }
}
