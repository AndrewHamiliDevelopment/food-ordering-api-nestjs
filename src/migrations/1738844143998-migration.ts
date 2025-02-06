import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738844143998 implements MigrationInterface {
    name = 'Migration1738844143998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
