import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743752619960 implements MigrationInterface {
    name = 'Migration1743752619960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('UNPAID', 'PAID', 'PROCESSING', 'PROCESSED', 'IN TRANSIT', 'DELIVERED') NOT NULL DEFAULT 'UNPAID'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('UNPAID', 'PAID', 'PROCESSING', 'PROCESSED', 'IN TRANSIT', 'DELIVERED') NOT NULL DEFAULT 'UNPAID'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('UNPAID', 'PENDING', 'PROCESSING', 'PROCESSED', 'IN TRANSIT', 'DELIVERED') NOT NULL DEFAULT 'UNPAID'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('UNPAID', 'PENDING', 'PROCESSING', 'PROCESSED', 'IN TRANSIT', 'DELIVERED') NOT NULL DEFAULT 'UNPAID'`);
    }

}
