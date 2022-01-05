import { Controller, Get, Param } from '@nestjs/common'
import { ImportService } from '../import/import.service'

@Controller('/import')
export class ImportApiController {
  constructor(private readonly importService: ImportService) {}
  @Get('/:mediaId')
  async getMedia(@Param('mediaId') mediaId: string) {
    return this.importService.importDownload(mediaId)
  }
}
