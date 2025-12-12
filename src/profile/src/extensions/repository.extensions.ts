import { IProfileRepository, ProfileRepository } from '@data/repositories/profile.repository';
import { container } from 'tsyringe';

export const registerRepositories = async (): Promise<void> => {
  container.register<IProfileRepository>('IProfileRepository', ProfileRepository);
};
