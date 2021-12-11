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

  @Column()
  name: string

  @Column()
  query: string

  @Column()
  user: string

  @Column()
  items: number

  @Column()
  type: string

  @Column({ default: false })
  completed: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
