import { Token } from '@auth/entities/token.entity';
import { User } from '@user/entities/user.entity';
import config from 'building-blocks/config/config';
import { DataSource, DataSourceOptions } from 'building-blocks/typeorm';

// use this file for running migration
export const postgresOptions: DataSourceOptions = {
  type: 'postgres',
  host: config.postgres.host,
  port: config.postgres.port,
  username: config.postgres.username,
  password: config.postgres.password,
  database: config.postgres.database,
  synchronize: config.postgres.synchronize,
  entities: [User, Token],
  migrations: [__dirname + config.postgres.migrations],
  logging: config.postgres.logging
};

const dataSource = new DataSource(postgresOptions);

export default dataSource;
