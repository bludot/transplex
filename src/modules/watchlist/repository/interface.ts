export interface IWatchlist {
  readonly id: string
  readonly mediaId: string
  readonly indexData: any
  readonly lastRun: Date
  readonly timesRan: number
  readonly items: number
  readonly completed: boolean
  readonly updatedAt: Date
}
