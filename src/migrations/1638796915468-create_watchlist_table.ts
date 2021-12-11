import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createWatchlistTable1638796915468 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'watchlist',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'query',
            type: 'varchar',
          },
          {
            name: 'user',
            type: 'varchar',
          },
          {
            name: 'items',
            type: 'integer',
          },
          {
            name: 'completed',
            type: 'boolean',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('watchlist')
  }
}
