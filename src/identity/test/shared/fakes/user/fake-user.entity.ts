import { faker } from '@faker-js/faker';
import { UserStatus } from 'building-blocks/contracts/identity.contract';
import { User } from '../../../../src/user/entities/user.entity';
import { Role } from '../../../../src/user/enums/role.enum';

export class FakeUser {
  static generate(): User {
    const user: User = {
      id: 1,
      role: Role.USER,
      password: 'Admin@1234',
      email: faker.internet.email(),
      createdAt: faker.date.anytime(),
      tokens: [],
      status: UserStatus.ACTIVE
    };

    return user;
  }
}
