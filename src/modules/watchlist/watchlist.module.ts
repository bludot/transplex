import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NyaapiModule } from '../nyaapi/nyaapi.module'
import { TransmissionModule } from '../transmission/transmission.module'
import { WatchlistRepository } from './repository/watchlist.repository'
import { WatchlistService } from './watchlist.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([WatchlistRepository]),
    NyaapiModule,
    TransmissionModule,
  ],
  providers: [WatchlistService],
  exports: [WatchlistService],
})
export class WatchlistModule {}
