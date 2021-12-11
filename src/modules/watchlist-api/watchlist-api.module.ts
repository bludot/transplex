import { Module } from '@nestjs/common'
import { WatchlistModule } from '../watchlist/watchlist.module'
import { WatchlistApiController } from './watchlist-api.controller'

@Module({
  imports: [WatchlistModule],
  controllers: [WatchlistApiController],
})
export class WatchlistApiModule {}
