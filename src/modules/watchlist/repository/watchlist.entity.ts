import { MediaType } from 'express'
import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryColumn,
  Generated,
} from 'typeorm'

@Entity({ name: 'watchlist' })
export class Watchlist {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string

  @Column({ name: 'media_id' })
  mediaId: string

  @Column({ name: 'index_data', type: 'jsonb' })
  indexData: any

  @CreateDateColumn({ name: 'last_run' })
  lastRun: Date

  @Column()
  items: number

  @Column({ name: 'times_ran' })
  timesRan: number

  @Column({ default: false })
  completed: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
