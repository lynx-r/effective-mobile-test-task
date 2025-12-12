import { LoginRequestDto } from '@auth/features/v1/login/login';

export class FakeCreateLoginRequestDto {
  static generate(): LoginRequestDto {
    const createUserRequestDto = {
      email: 'dev@dev.com',
      password: 'Admin@12345'
    };

    return createUserRequestDto;
  }
}
