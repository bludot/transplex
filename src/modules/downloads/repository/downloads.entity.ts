import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryColumn,
  Generated,
} from 'typeorm'

@Entity({ name: 'downloads' })
export class Downloads {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string

  @Column({ name: 'media_id' })
  mediaId: string

  @Column()
  item: number

  @Column({ name: 'watchlist_id' })
  watchlistId: string

  @Column()
  status: string

  @Column()
  data: string

  @CreateDateColumn({ name: 'added_at' })
  added: Date

  @Column({ name: 'magnet_link' })
  magnetlink: string

  @Column()
  hash: string

  @CreateDateColumn({ name: 'completed' })
  completed: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
