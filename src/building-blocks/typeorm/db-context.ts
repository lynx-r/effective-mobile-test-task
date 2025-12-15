import { injectable } from 'tsyringe';
import { DataSource, DataSourceOptions } from 'typeorm';
import { createDatabase } from 'typeorm-extension';
import config from '../config/config';
import { Logger } from '../logging/logger';

let connection: DataSource = null;

export interface IDbContext {
  initializeTypeorm(dataSourceOptions: DataSourceOptions): Promise<DataSource>;

  closeConnection(): Promise<void>;

  get connection(): DataSource | null;
}

export interface IDataSeeder {
  seedData(dataSource: DataSource): Promise<void>;
}

@injectable()
export class DbContext implements IDbContext {
  async initializeTypeorm(dataSourceOptions: DataSourceOptions): Promise<DataSource> {
    try {
      if (config.env !== 'test') {
        await createDatabase({
          options: dataSourceOptions
        });
      }

      connection = await new DataSource(dataSourceOptions).initialize();

      Logger.info('Data Source has been initialized!');

      process.on('SIGINT', async () => {
        if (connection) {
          await this.closeConnection();
        }
      });

      if (config.env !== 'test') {
        try {
        } catch {
          Logger.error('Error during running the Migrations!');
        }
        await connection.runMigrations();
        Logger.info('Migrations run successfully!');
      }
    } catch (error) {
      throw new Error(error);
    }

    return connection;
  }

  get connection(): DataSource | null {
    return connection;
  }

  async closeConnection(): Promise<void> {
    if (connection.isInitialized) {
      await connection.destroy();
      Logger.info('Connection postgres destroyed gracefully!');
    }
  }
}
