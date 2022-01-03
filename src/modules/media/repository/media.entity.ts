import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryColumn,
  Generated,
} from 'typeorm'

@Entity({ name: 'media' })
export class Media {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string

  @Column()
  name: string

  @Column()
  type: string

  @CreateDateColumn()
  anime: boolean

  @Column()
  watch: boolean

  @Column({ name: 'anidb_id' })
  anidbId: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
