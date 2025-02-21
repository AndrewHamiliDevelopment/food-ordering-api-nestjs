import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740096646898 implements MigrationInterface {
    name = 'Migration1740096646898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`resource\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`filename\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, \`thumbnailId\` int NULL, \`parentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`price\` decimal(18,4) NOT NULL DEFAULT '0.0000', \`enabled\` tinyint NOT NULL DEFAULT 1, \`categoryId\` int NULL, \`thumbnailId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_snapshot\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`price\` decimal(18,4) NOT NULL, \`enabled\` tinyint NOT NULL, \`productId\` int NULL, \`categoryId\` int NULL, \`thumbnailId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_detail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`lastName\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`middleName\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_455dfebe9344ffecf1c8e8e054\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`uid\` varchar(255) NOT NULL, \`displayName\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`emailVerified\` tinyint NOT NULL, \`phoneNumber\` varchar(255) NULL, \`photoURL\` varchar(255) NULL, \`disabled\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`line1\` varchar(255) NOT NULL, \`line2\` varchar(255) NOT NULL, \`cityMunicipality\` varchar(255) NOT NULL, \`province\` varchar(255) NOT NULL, \`zipCode\` varchar(255) NOT NULL, \`recipientName\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment_method\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`additionalNotes\` text NOT NULL, \`enabled\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`quantity\` int NOT NULL, \`cartId\` int NOT NULL, \`productId\` int NULL, UNIQUE INDEX \`REL_75db0de134fe0f9fe9e4591b7b\` (\`productId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`uuid\` varchar(36) NOT NULL, \`isCheckedOut\` tinyint NOT NULL DEFAULT 0, \`dateCheckedOut\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateDeleted\` datetime(6) NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateEntry\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`status\` enum ('PENDING', 'PROCESSING', 'IN TRANSIT', 'DELIVERED') NOT NULL DEFAULT 'PENDING', \`cartId\` int NULL, \`addressId\` int NULL, UNIQUE INDEX \`REL_fe3963d525b2ee03ba471953a7\` (\`cartId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_images_resource\` (\`productId\` int NOT NULL, \`resourceId\` int NOT NULL, INDEX \`IDX_5334c2949729afb88ca19ed702\` (\`productId\`), INDEX \`IDX_2c7e65581aba272453ab9d6ef6\` (\`resourceId\`), PRIMARY KEY (\`productId\`, \`resourceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_4aa1348fc4b7da9bef0fae8ff4\` (\`id_ancestor\`), INDEX \`IDX_6a22002acac4976977b1efd114\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`address\` DROP COLUMN \`recipientName\``);
        await queryRunner.query(`ALTER TABLE \`address\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`address\` ADD \`recipientName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`address\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`addressId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_b2b6b5da51d2de2758ed9d77597\` FOREIGN KEY (\`thumbnailId\`) REFERENCES \`resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_d5456fd7e4c4866fec8ada1fa10\` FOREIGN KEY (\`parentId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_ff0c0301a95e517153df97f6812\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_456e5260737ee96131684812bd8\` FOREIGN KEY (\`thumbnailId\`) REFERENCES \`resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_snapshot\` ADD CONSTRAINT \`FK_6b4549576114ac4a91ba1e035c4\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_snapshot\` ADD CONSTRAINT \`FK_f4c73213988813bb1a52cd6240f\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_snapshot\` ADD CONSTRAINT \`FK_85f0f12ca79c0e38f2e46990e52\` FOREIGN KEY (\`thumbnailId\`) REFERENCES \`resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_detail\` ADD CONSTRAINT \`FK_455dfebe9344ffecf1c8e8e054d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`address\` ADD CONSTRAINT \`FK_d25f1ea79e282cc8a42bd616aa3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_29e590514f9941296f3a2440d39\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_75db0de134fe0f9fe9e4591b7bf\` FOREIGN KEY (\`productId\`) REFERENCES \`product_snapshot\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_756f53ab9466eb52a52619ee019\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_fe3963d525b2ee03ba471953a7c\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_73f9a47e41912876446d047d015\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_5ad17e3bf3749fdddc6e8050d6e\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_images_resource\` ADD CONSTRAINT \`FK_5334c2949729afb88ca19ed7023\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product_images_resource\` ADD CONSTRAINT \`FK_2c7e65581aba272453ab9d6ef6e\` FOREIGN KEY (\`resourceId\`) REFERENCES \`resource\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`category_closure\` ADD CONSTRAINT \`FK_4aa1348fc4b7da9bef0fae8ff48\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_closure\` ADD CONSTRAINT \`FK_6a22002acac4976977b1efd114a\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category_closure\` DROP FOREIGN KEY \`FK_6a22002acac4976977b1efd114a\``);
        await queryRunner.query(`ALTER TABLE \`category_closure\` DROP FOREIGN KEY \`FK_4aa1348fc4b7da9bef0fae8ff48\``);
        await queryRunner.query(`ALTER TABLE \`product_images_resource\` DROP FOREIGN KEY \`FK_2c7e65581aba272453ab9d6ef6e\``);
        await queryRunner.query(`ALTER TABLE \`product_images_resource\` DROP FOREIGN KEY \`FK_5334c2949729afb88ca19ed7023\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_5ad17e3bf3749fdddc6e8050d6e\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_73f9a47e41912876446d047d015\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_fe3963d525b2ee03ba471953a7c\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_756f53ab9466eb52a52619ee019\``);
        await queryRunner.query(`ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_75db0de134fe0f9fe9e4591b7bf\``);
        await queryRunner.query(`ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_29e590514f9941296f3a2440d39\``);
        await queryRunner.query(`ALTER TABLE \`address\` DROP FOREIGN KEY \`FK_d25f1ea79e282cc8a42bd616aa3\``);
        await queryRunner.query(`ALTER TABLE \`user_detail\` DROP FOREIGN KEY \`FK_455dfebe9344ffecf1c8e8e054d\``);
        await queryRunner.query(`ALTER TABLE \`product_snapshot\` DROP FOREIGN KEY \`FK_85f0f12ca79c0e38f2e46990e52\``);
        await queryRunner.query(`ALTER TABLE \`product_snapshot\` DROP FOREIGN KEY \`FK_f4c73213988813bb1a52cd6240f\``);
        await queryRunner.query(`ALTER TABLE \`product_snapshot\` DROP FOREIGN KEY \`FK_6b4549576114ac4a91ba1e035c4\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_456e5260737ee96131684812bd8\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_ff0c0301a95e517153df97f6812\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_d5456fd7e4c4866fec8ada1fa10\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_b2b6b5da51d2de2758ed9d77597\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`addressId\``);
        await queryRunner.query(`ALTER TABLE \`address\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`address\` DROP COLUMN \`recipientName\``);
        await queryRunner.query(`ALTER TABLE \`address\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`address\` ADD \`recipientName\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_6a22002acac4976977b1efd114\` ON \`category_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_4aa1348fc4b7da9bef0fae8ff4\` ON \`category_closure\``);
        await queryRunner.query(`DROP TABLE \`category_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_2c7e65581aba272453ab9d6ef6\` ON \`product_images_resource\``);
        await queryRunner.query(`DROP INDEX \`IDX_5334c2949729afb88ca19ed702\` ON \`product_images_resource\``);
        await queryRunner.query(`DROP TABLE \`product_images_resource\``);
        await queryRunner.query(`DROP INDEX \`REL_fe3963d525b2ee03ba471953a7\` ON \`order\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`cart\``);
        await queryRunner.query(`DROP INDEX \`REL_75db0de134fe0f9fe9e4591b7b\` ON \`cart_item\``);
        await queryRunner.query(`DROP TABLE \`cart_item\``);
        await queryRunner.query(`DROP TABLE \`payment_method\``);
        await queryRunner.query(`DROP TABLE \`address\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_455dfebe9344ffecf1c8e8e054\` ON \`user_detail\``);
        await queryRunner.query(`DROP TABLE \`user_detail\``);
        await queryRunner.query(`DROP TABLE \`product_snapshot\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`resource\``);
    }

}
