import { registerRepositories } from '@extensions/repository.extensions';
import { DataSource, DataSourceOptions } from 'building-blocks/typeorm';
import { DbContext, IDbContext } from 'building-blocks/typeorm/db-context';
import { container } from 'tsyringe';
import { ProfileSeed } from './seeds/profile.seed';

export const initialDbContext = async (
  dataSourceOptions: DataSourceOptions
): Promise<DataSource> => {
  container.registerSingleton<IDbContext>('IDbContext', DbContext);

  const dbContext = container.resolve(DbContext);

  const connection = await dbContext.initializeTypeorm(dataSourceOptions);

  await registerRepositories();

  const profileSeed = container.resolve(ProfileSeed);

  await profileSeed.seedData();

  return connection;
};
