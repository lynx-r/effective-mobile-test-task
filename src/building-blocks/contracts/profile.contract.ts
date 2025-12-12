import { UserStatus } from './identity.contract';

export class ProfileDto {
  id: number;
  email: string;
  userId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthday: Date;
  status: UserStatus;
  createdAt: Date;
  updatedAt?: Date;

  constructor(partial: Partial<ProfileDto>) {
    Object.assign(this, partial);
  }
}
