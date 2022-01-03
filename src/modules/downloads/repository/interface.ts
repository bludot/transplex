export interface IDownloads {
  readonly id: string
  readonly mediaId: string
  readonly item: number
  readonly watchlistId: string
  readonly status: string
  readonly data: string
  readonly added: Date
  readonly magnetlink: string
  readonly hash: string
  readonly completed: Date
  readonly updatedAt: Date
}
