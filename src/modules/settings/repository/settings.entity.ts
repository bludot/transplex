import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryColumn,
  Generated,
} from 'typeorm'

@Entity({ name: 'settings' })
export class Settings {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string

  @Column()
  name: string

  @Column()
  value: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
