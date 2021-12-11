export interface IWatchlist {
  readonly id: string
  readonly name: string
  readonly query: string
  readonly user: string
  readonly items: number
  readonly completed: boolean
  readonly type: string
  readonly updatedAt: Date
}
