import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { FileManagerService } from '../file-manager/file-manager.service'
import { FileMapDTO } from './file-manager-api.dto'

@Controller('/filemanager')
export class FileManagerApiController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Get('/:mediaId')
  async getMedia(@Param('mediaId') mediaId: string) {
    return this.fileManagerService.getMappedFiles(mediaId)
  }

  @Post('/:mediaId/mapping')
  async postMapping(
    @Param('mediaId') mediaId: string,
    @Body() body: FileMapDTO,
  ) {
    return this.fileManagerService.addFileMapping({
      ...body,
    })
  }
}
