import { DataSource, DataSourceOptions } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
require('dotenv').config();

export interface DatabaseConfigInterface {
  type: string;
  database: string;
  port: number;
  host: string;
  password?: string;
  username?: string;
  entities: string[];
  migrations: string[];
  logging?: boolean;
  options?: any;
  driver?: any;
  extra?: any;
  requestTimeout?: number;
}

// DATABASE_HOST=localhost
// DATABASE_PORT=3306
// DATABASE_NAME=finance-nest
// DATABASE_USERNAME=finance-nest
// DATABASE_PASSWORD=f1n@nc3

export const getDatabaseConfig = (): DatabaseConfigInterface => {
    console.log(process.env.DATABASE_USERNAME);
  return {
    type: 'mysql',
    database: process.env.DATABASE_NAME,
    port: parseInt(process.env.DATABASE_PORT),
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USERNAME,
    logging: true,
    entities: [__dirname + '/../../**/entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  };
};

export const connectionSource = new DataSource(
  getDatabaseConfig() as DataSourceOptions,
);
