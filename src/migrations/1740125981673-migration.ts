import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740125981673 implements MigrationInterface {
    name = 'Migration1740125981673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_5ad17e3bf3749fdddc6e8050d6e\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`addressId\``);
        await queryRunner.query(`ALTER TABLE \`payment_method\` CHANGE \`enabled\` \`enabled\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`payment_method\` CHANGE \`enabled\` \`enabled\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment_method\` CHANGE \`enabled\` \`enabled\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment_method\` CHANGE \`enabled\` \`enabled\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`addressId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_5ad17e3bf3749fdddc6e8050d6e\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
