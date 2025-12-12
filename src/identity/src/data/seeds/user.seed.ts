import { UserRepository } from '@data/repositories/user.repository';
import { User } from '@user/entities/user.entity';
import { Role } from 'building-blocks/contracts/identity.contract';
import { Logger } from 'building-blocks/logging/logger';
import { IDataSeeder } from 'building-blocks/typeorm/db-context';
import { encryptPassword } from 'building-blocks/utils/encryption';
import { container } from 'tsyringe';

export class UserSeed implements IDataSeeder {
  async seedData(): Promise<void> {
    const userRepository = container.resolve(UserRepository);
    if ((await userRepository.getAllUsers())?.length == 0) {
      await userRepository.createUser(
        new User({
          email: 'dev@dev.com',
          password: await encryptPassword('Admin@12345'),
          role: Role.ADMIN
        })
      );
      Logger.info('Seed users run successfully!');
    }
  }
}
