import { Controller, Get } from '@nestjs/common'
import { SettingsService } from '../settings/settings.service'

@Controller('/settings')
export class SettingsApiController {
  constructor(private readonly settingsService: SettingsService) {}
  @Get('/')
  async getSettings() {
    return this.settingsService.getSettings()
  }
}
