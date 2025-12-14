import { faker } from '@faker-js/faker';
import { UserDto } from '@user/dtos/user.dto';
import { BlockUser } from '@user/features/v1/block-user/block-user';
import { TokenScope, TokenType } from 'building-blocks/contracts/identity.contract';

export class FakeBlockUser {
  static generate(user?: UserDto): BlockUser {
    const createUser = new BlockUser({
      id: user?.id || 1,
      user: {
        email: user?.email ?? faker.internet.email(),
        userId: String(user?.id ?? 1),
        scopes: [TokenScope.ADMIN, TokenScope.USER],
        type: TokenType.ACCESS
      }
    });

    return createUser;
  }
}
