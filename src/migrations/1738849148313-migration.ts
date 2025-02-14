import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738849148313 implements MigrationInterface {
    name = 'Migration1738849148313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_detail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`lastName\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`middleName\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_455dfebe9344ffecf1c8e8e054\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_detail\` ADD CONSTRAINT \`FK_455dfebe9344ffecf1c8e8e054d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_detail\` DROP FOREIGN KEY \`FK_455dfebe9344ffecf1c8e8e054d\``);
        await queryRunner.query(`DROP INDEX \`REL_455dfebe9344ffecf1c8e8e054\` ON \`user_detail\``);
        await queryRunner.query(`DROP TABLE \`user_detail\``);
    }

}
