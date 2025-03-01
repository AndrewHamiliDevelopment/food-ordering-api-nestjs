import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740790578686 implements MigrationInterface {
    name = 'Migration1740790578686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_fe3963d525b2ee03ba471953a7c\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_73f9a47e41912876446d047d015\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_89726ee65618314009b279e66e8\``);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`cartId\` \`cartId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`addressId\` \`addressId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`paymentMethodId\` \`paymentMethodId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_fe3963d525b2ee03ba471953a7c\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_73f9a47e41912876446d047d015\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_89726ee65618314009b279e66e8\` FOREIGN KEY (\`paymentMethodId\`) REFERENCES \`payment_method\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_89726ee65618314009b279e66e8\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_73f9a47e41912876446d047d015\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_fe3963d525b2ee03ba471953a7c\``);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`paymentMethodId\` \`paymentMethodId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`addressId\` \`addressId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`cartId\` \`cartId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_89726ee65618314009b279e66e8\` FOREIGN KEY (\`paymentMethodId\`) REFERENCES \`payment_method\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_73f9a47e41912876446d047d015\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_fe3963d525b2ee03ba471953a7c\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
