import { ProfileRepository } from '@data/repositories/profile.repository';
import { Profile } from '@profile/entities/profile.entity';
import { UserCreated } from 'building-blocks/contracts/identity.contract';
import { Logger } from 'building-blocks/logging/logger';
import { container } from 'tsyringe';

const createUserConsumerHandler = async (queue: string, message: UserCreated) => {
  const logger = container.resolve(Logger);

  if (message == null || message == undefined) return;

  const profileRepository = new ProfileRepository();
  const profile = await profileRepository.createProfile(
    new Profile({
      email: message.email,
      userId: message.id,
      status: message.status,
      firstName: '',
      middleName: '',
      lastName: '',
      createdAt: new Date()
    })
  );

  logger.info(`Profile with name: ${profile?.email} created.`);
};

export default createUserConsumerHandler;
