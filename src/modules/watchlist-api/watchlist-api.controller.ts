import { Body, Controller, Get, Put } from '@nestjs/common'
import { WatchlistService } from '../watchlist/watchlist.service'
import { AddToWatchlistDto } from './watchlist-api.dto'

@Controller()
export class WatchlistApiController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get('/watchlist')
  async updateWatchlist() {
    return this.watchlistService.updateWatchlist()
  }

  @Put('/watchlist')
  async addToWatchlist(@Body() body: AddToWatchlistDto) {
    return this.watchlistService.addWatchList(
      body.name,
      body.query,
      body.user,
      body.items,
      body.type,
    )
  }
}
