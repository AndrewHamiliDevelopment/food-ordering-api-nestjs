import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739667915000 implements MigrationInterface {
  name = 'Migration1739667915000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`thumbnailId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD CONSTRAINT \`FK_b2b6b5da51d2de2758ed9d77597\` FOREIGN KEY (\`thumbnailId\`) REFERENCES \`resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_b2b6b5da51d2de2758ed9d77597\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP COLUMN \`thumbnailId\``,
    );
  }
}
