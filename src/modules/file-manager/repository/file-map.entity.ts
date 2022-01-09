import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryColumn,
  Generated,
} from 'typeorm'

@Entity({ name: 'filemap' })
export class FileMap {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string

  @Column({ name: 'media_id' })
  mediaId: string

  @Column({ name: 'file_name' })
  fileName: string

  @Column({ name: 'episode_name' })
  episodeName: string

  @Column({ name: 'episode_number' })
  episodeNumber: number

  @Column({ name: 'season_number' })
  seasonNumber: number

  @Column({ name: 'media_type' })
  mediaType: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
