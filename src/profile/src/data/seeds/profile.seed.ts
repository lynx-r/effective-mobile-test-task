import { ProfileRepository } from '@data/repositories/profile.repository';
import { Profile } from '@profile/entities/profile.entity';
import { UserStatus } from 'building-blocks/contracts/identity.contract';
import { Logger } from 'building-blocks/logging/logger';
import { IDataSeeder } from 'building-blocks/typeorm/db-context';
import { container } from 'tsyringe';

export class ProfileSeed implements IDataSeeder {
  async seedData(): Promise<void> {
    const profileRepository = container.resolve(ProfileRepository);
    if ((await profileRepository.getAllProfiles())?.length == 0) {
      await profileRepository.createProfile(
        new Profile({
          email: 'dev@dev.com',
          userId: 1,
          firstName: 'Aleksei',
          middleName: 'Leonidovich',
          lastName: 'Popriadukhin',
          birthday: new Date(1986, 11, 16),
          createdAt: new Date(),
          status: UserStatus.ACTIVE
        })
      );
      Logger.info('Seed users run successfully!');
    }
  }
}
