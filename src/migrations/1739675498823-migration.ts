import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739675498823 implements MigrationInterface {
  name = 'Migration1739675498823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`nsleft\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`nsright\` int NOT NULL DEFAULT '2'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`parentId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD CONSTRAINT \`FK_d5456fd7e4c4866fec8ada1fa10\` FOREIGN KEY (\`parentId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_d5456fd7e4c4866fec8ada1fa10\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP COLUMN \`parentId\``,
    );
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`nsright\``);
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`nsleft\``);
  }
}
