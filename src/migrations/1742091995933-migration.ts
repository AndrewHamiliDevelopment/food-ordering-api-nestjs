import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742091995933 implements MigrationInterface {
    name = 'Migration1742091995933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_89726ee65618314009b279e66e8\``);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`paymentMethodId\` \`paymentMethod\` int NOT NULL`);
        await queryRunner.query(`CREATE TABLE \`payment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`paymentMethodProps\` json NOT NULL, \`orderId\` int NULL, UNIQUE INDEX \`REL_d09d285fe1645cd2f0db811e29\` (\`orderId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`paymentMethod\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`paymentMethod\` enum ('cash', 'paypal') NOT NULL DEFAULT 'cash'`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_d09d285fe1645cd2f0db811e293\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_d09d285fe1645cd2f0db811e293\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`paymentMethod\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`paymentMethod\` int NOT NULL`);
        await queryRunner.query(`DROP INDEX \`REL_d09d285fe1645cd2f0db811e29\` ON \`payment\``);
        await queryRunner.query(`DROP TABLE \`payment\``);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`paymentMethod\` \`paymentMethodId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_89726ee65618314009b279e66e8\` FOREIGN KEY (\`paymentMethodId\`) REFERENCES \`payment_method\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
