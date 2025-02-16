import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739666814776 implements MigrationInterface {
  name = 'Migration1739666814776';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`resource\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`filename\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`resource\``);
    await queryRunner.query(`DROP TABLE \`category\``);
  }
}
