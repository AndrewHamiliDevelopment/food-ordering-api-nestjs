import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739773771878 implements MigrationInterface {
  name = 'Migration1739773771878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_detail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`lastName\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`middleName\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_455dfebe9344ffecf1c8e8e054\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`uid\` varchar(255) NOT NULL, \`displayName\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`emailVerified\` tinyint NOT NULL, \`phoneNumber\` varchar(255) NULL, \`photoURL\` varchar(255) NULL, \`disabled\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`resource\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`filename\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, \`thumbnailId\` int NULL, \`parentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, \`categoryId\` int NULL, \`thumbnailId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`productId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_images_resource\` (\`productId\` int NOT NULL, \`resourceId\` int NOT NULL, INDEX \`IDX_5334c2949729afb88ca19ed702\` (\`productId\`), INDEX \`IDX_2c7e65581aba272453ab9d6ef6\` (\`resourceId\`), PRIMARY KEY (\`productId\`, \`resourceId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`category_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_4aa1348fc4b7da9bef0fae8ff4\` (\`id_ancestor\`), INDEX \`IDX_6a22002acac4976977b1efd114\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_detail\` ADD CONSTRAINT \`FK_455dfebe9344ffecf1c8e8e054d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD CONSTRAINT \`FK_b2b6b5da51d2de2758ed9d77597\` FOREIGN KEY (\`thumbnailId\`) REFERENCES \`resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD CONSTRAINT \`FK_d5456fd7e4c4866fec8ada1fa10\` FOREIGN KEY (\`parentId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD CONSTRAINT \`FK_ff0c0301a95e517153df97f6812\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD CONSTRAINT \`FK_456e5260737ee96131684812bd8\` FOREIGN KEY (\`thumbnailId\`) REFERENCES \`resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_40ca0cd115ef1ff35351bed8da2\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_images_resource\` ADD CONSTRAINT \`FK_5334c2949729afb88ca19ed7023\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_images_resource\` ADD CONSTRAINT \`FK_2c7e65581aba272453ab9d6ef6e\` FOREIGN KEY (\`resourceId\`) REFERENCES \`resource\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category_closure\` ADD CONSTRAINT \`FK_4aa1348fc4b7da9bef0fae8ff48\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category_closure\` ADD CONSTRAINT \`FK_6a22002acac4976977b1efd114a\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`category_closure\` DROP FOREIGN KEY \`FK_6a22002acac4976977b1efd114a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`category_closure\` DROP FOREIGN KEY \`FK_4aa1348fc4b7da9bef0fae8ff48\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_images_resource\` DROP FOREIGN KEY \`FK_2c7e65581aba272453ab9d6ef6e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_images_resource\` DROP FOREIGN KEY \`FK_5334c2949729afb88ca19ed7023\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_40ca0cd115ef1ff35351bed8da2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_456e5260737ee96131684812bd8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_ff0c0301a95e517153df97f6812\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_d5456fd7e4c4866fec8ada1fa10\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_b2b6b5da51d2de2758ed9d77597\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_detail\` DROP FOREIGN KEY \`FK_455dfebe9344ffecf1c8e8e054d\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_6a22002acac4976977b1efd114\` ON \`category_closure\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4aa1348fc4b7da9bef0fae8ff4\` ON \`category_closure\``,
    );
    await queryRunner.query(`DROP TABLE \`category_closure\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2c7e65581aba272453ab9d6ef6\` ON \`product_images_resource\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5334c2949729afb88ca19ed702\` ON \`product_images_resource\``,
    );
    await queryRunner.query(`DROP TABLE \`product_images_resource\``);
    await queryRunner.query(`DROP TABLE \`product_image\``);
    await queryRunner.query(`DROP TABLE \`product\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(`DROP TABLE \`resource\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`REL_455dfebe9344ffecf1c8e8e054\` ON \`user_detail\``,
    );
    await queryRunner.query(`DROP TABLE \`user_detail\``);
  }
}
