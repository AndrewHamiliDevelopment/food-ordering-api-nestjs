import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742095630219 implements MigrationInterface {
    name = 'Migration1742095630219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`uuid\` varchar(36) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`uuid\``);
    }

}
