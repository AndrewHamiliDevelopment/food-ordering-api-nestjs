import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738848507243 implements MigrationInterface {
    name = 'Migration1738848507243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`uid\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`displayName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`emailVerified\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`phoneNumber\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`photoURL\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`disabled\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`disabled\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`photoURL\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phoneNumber\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`emailVerified\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`displayName\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`uid\``);
    }

}
