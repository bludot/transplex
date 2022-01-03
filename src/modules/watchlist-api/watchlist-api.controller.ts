import { Body, Controller, Get, Put } from '@nestjs/common'
import { WatchlistService } from '../watchlist/watchlist.service'
import { AddToWatchlistDto } from './watchlist-api.dto'

@Controller('/watchlist')
export class WatchlistApiController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get('/sync')
  async updateWatchlist() {
    return this.watchlistService.updateWatchlist()
  }

  @Get('/')
  async getWatchlists() {
    return this.watchlistService.getWatchlists()
  }

  @Put('/')
  async addToWatchlist(@Body() body: AddToWatchlistDto) {
    return this.watchlistService.addWatchList(
      body.mediaId,
      body.name,
      body.query,
      body.user,
      body.items,
      body.type,
    )
  }
}
