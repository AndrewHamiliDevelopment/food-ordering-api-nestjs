import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740989351951 implements MigrationInterface {
    name = 'Migration1740989351951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('UNPAID', 'PENDING', 'PROCESSING', 'PROCESSED', 'IN TRANSIT', 'DELIVERED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('UNPAID', 'PENDING', 'PROCESSING', 'PROCESSED', 'IN TRANSIT', 'DELIVERED') NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('PENDING', 'PROCESSING', 'IN TRANSIT', 'DELIVERED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('PENDING', 'PROCESSING', 'IN TRANSIT', 'DELIVERED') NOT NULL DEFAULT 'PENDING'`);
    }

}
