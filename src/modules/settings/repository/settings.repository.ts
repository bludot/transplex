import { EntityRepository, Repository } from 'typeorm'
import * as _ from 'lodash'
import { ISettings } from './interface'
import { Settings } from './settings.entity'

@EntityRepository(Settings)
export class SettingsRepository extends Repository<Settings> {
  public async findOneById(id: string): Promise<ISettings> {
    const settingsItem: Settings = await this.findOne({
      where: { id },
    })

    return settingsItem
      ? {
          id: settingsItem.id,
          name: settingsItem.name,
          value: settingsItem.value,
          updatedAt: settingsItem.updatedAt,
        }
      : null
  }

  public async findOneByName(name: string): Promise<ISettings> {
    const settingsItem: Settings = await this.findOne({
      where: { name },
    })

    return settingsItem
      ? {
          id: settingsItem.id,
          name: settingsItem.name,
          value: settingsItem.value,
          updatedAt: settingsItem.updatedAt,
        }
      : null
  }

  public async findAll(): Promise<ISettings[]> {
    const settingsItems: Settings[] = await this.find()
    return settingsItems.map((settingsItem) => ({
      id: settingsItem.id,
      name: settingsItem.name,
      value: settingsItem.value,
      updatedAt: settingsItem.updatedAt,
    }))
  }

  public async upsert(body: Partial<Settings>): Promise<ISettings> {
    // eslint-disable-next-line
    let nullFields: readonly string[] = Object.keys(body).reduce(
      (empty: readonly string[], key: string) =>
        body[key] === undefined ? empty.concat(key) : empty,
      [],
    )
    // eslint-disable-next-line
    let cleanBody: Settings = _.omit(body, nullFields) as Settings
    // eslint-disable-next-line
    let savedSettingsItem: Settings = await this.findOne({ name: cleanBody.name })
    if (savedSettingsItem) {
      await this.update({ id: savedSettingsItem.id }, cleanBody)
      const settingsItem = { ...savedSettingsItem, ...cleanBody }
      return {
        id: settingsItem.id,
        name: settingsItem.name,
        value: settingsItem.value,
        updatedAt: settingsItem.updatedAt,
      }
    }

    // eslint-disable-next-line
    let newSettingsItem: Settings = this.create(cleanBody)
    const saved: Settings = await this.save(newSettingsItem)
    newSettingsItem = null
    cleanBody = null
    nullFields = null
    savedSettingsItem = null
    return {
      id: saved.id,
      name: saved.name,
      value: saved.value,
      updatedAt: saved.updatedAt,
    }
  }

  async removeByName(name: string) {
    this.delete({ name })
  }
}
