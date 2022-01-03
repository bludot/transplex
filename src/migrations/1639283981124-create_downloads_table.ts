import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createDownloadsTable1639283981124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'downloads',
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
            type: 'varchar',
          },
          {
            name: 'item',
            type: 'integer',
          },
          {
            name: 'watchlist_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'PENDING'",
          },
          {
            name: 'data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'added_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'magnet_link',
            type: 'varchar',
          },
          {
            name: 'hash',
            type: 'varchar',
          },
          {
            name: 'completed',
            type: 'timestamp',
            default: null,
            isNullable: true,
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
        /*
        foreignKeys: [
          {
            name: 'DownloadsMediaId',
            columnNames: ['media_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'media',

            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'DownloadsWatchlistId',
            columnNames: ['watchlist_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'watchlists',

            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        */
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('downloads')
  }
}
