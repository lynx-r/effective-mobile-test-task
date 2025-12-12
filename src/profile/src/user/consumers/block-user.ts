import { ProfileRepository } from '@data/repositories/profile.repository';
import { UserCreated } from 'building-blocks/contracts/identity.contract';
import { Logger } from 'building-blocks/logging/logger';
import { container } from 'tsyringe';

const blockUserConsumerHandler = async (queue: string, message: UserCreated) => {
  const logger = container.resolve(Logger);

  if (message == null || message == undefined) return;

  const profileRepository = new ProfileRepository();
  const profile = await profileRepository.findProfileByUserId(message.id);
  profile.status = message.status;
  profile.updatedAt = new Date();
  await profileRepository.saveProfile(profile);

  logger.info(`Profile with name: ${profile?.email} blocked.`);
};

export default blockUserConsumerHandler;
