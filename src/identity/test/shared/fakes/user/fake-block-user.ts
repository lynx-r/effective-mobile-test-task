import { BlockUser } from '@user/features/v1/block-user/block-user';
import { TokenScope, TokenType } from 'building-blocks/contracts/identity.contract';
import { User } from '../../../../src/user/entities/user.entity';

export class FakeBlockUser {
  static generate(user?: User): BlockUser {
    const createUser = new BlockUser({
      id: user?.id,
      user: {
        email: user?.email,
        userId: String(user?.id ?? 1),
        scopes: [TokenScope.ADMIN, TokenScope.USER],
        type: TokenType.ACCESS
      }
    });

    return createUser;
  }
}
