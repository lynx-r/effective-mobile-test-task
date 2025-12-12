import { UserStatus } from 'building-blocks/contracts/identity.contract';
import { Role } from '../enums/role.enum';

export class UserDto {
  id: number;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt?: Date;
  status: UserStatus;

  constructor(request: Partial<UserDto> = {}) {
    Object.assign(this, request);
  }
}
