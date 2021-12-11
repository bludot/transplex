import { Module } from '@nestjs/common'
import { NyaapiService } from './nyaapi.service'

@Module({
  imports: [],
  providers: [NyaapiService],
  exports: [NyaapiService],
})
export class NyaapiModule {}
