import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1740189364911 implements MigrationInterface {
  name = 'Migration1740189364911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_892f41d9437a9403e094ac6dd62\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`paymentMethodIdId\` \`paymentMethodId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`paymentMethodId\` \`paymentMethodIdId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`paymentMethodIdId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`address\` ADD \`contactNumber\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`paymentMethodId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`paymentMethodIdId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_89726ee65618314009b279e66e8\` FOREIGN KEY (\`paymentMethodId\`) REFERENCES \`payment_method\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_892f41d9437a9403e094ac6dd62\` FOREIGN KEY (\`paymentMethodIdId\`) REFERENCES \`payment_method\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_892f41d9437a9403e094ac6dd62\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_89726ee65618314009b279e66e8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`paymentMethodIdId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`paymentMethodId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`address\` DROP COLUMN \`contactNumber\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`paymentMethodIdId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`paymentMethodIdId\` \`paymentMethodId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`paymentMethodId\` \`paymentMethodIdId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_892f41d9437a9403e094ac6dd62\` FOREIGN KEY (\`paymentMethodIdId\`) REFERENCES \`payment_method\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
