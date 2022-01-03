export interface IMedia {
  readonly id: string
  readonly name: string
  readonly type: string
  readonly anime: boolean
  readonly watch: boolean
  readonly anidbId: string
  readonly updatedAt: Date
}
