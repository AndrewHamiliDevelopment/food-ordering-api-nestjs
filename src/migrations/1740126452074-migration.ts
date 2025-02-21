import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740126452074 implements MigrationInterface {
    name = 'Migration1740126452074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`paymentMethodIdId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_892f41d9437a9403e094ac6dd62\` FOREIGN KEY (\`paymentMethodIdId\`) REFERENCES \`payment_method\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_892f41d9437a9403e094ac6dd62\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`paymentMethodIdId\``);
    }

}
