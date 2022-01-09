import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createFilemapTable1641550247226 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'filemap',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'media_id',
            type: 'uuid',
          },
          {
            name: 'file_name',
            type: 'varchar',
          },
          {
            name: 'episode_name',
            type: 'varchar',
          },
          {
            name: 'episode_number',
            type: 'int',
          },
          {
            name: 'season_number',
            type: 'int',
          },
          {
            name: 'media_type',
            type: 'varchar',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('filemap')
  }
}
