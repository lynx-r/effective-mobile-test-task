import { AuthDto } from '@auth/dtos/auth.dto';
import { IUserRepository } from '@data/repositories/user.repository';
import { Role } from '@user/enums/role.enum';
import { TokenScope } from 'building-blocks/contracts/identity.contract';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import ApplicationException from 'building-blocks/types/exception/application.exception';
import { isPasswordMatch } from 'building-blocks/utils/encryption';
import { password } from 'building-blocks/utils/validation';
import Joi from 'joi';
import { Body, Controller, Post, Route, SuccessResponse } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { GenerateToken } from '../generate-token/generate-token';

export class Login implements IRequest<AuthDto> {
  email: string;
  password: string;

  constructor(request: Partial<Login> = {}) {
    Object.assign(this, request);
  }
}

export class LoginRequestDto {
  email: string;
  password: string;

  constructor(request: Partial<LoginRequestDto> = {}) {
    Object.assign(this, request);
  }
}

const loginValidations = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().custom(password)
});

function createTokenScopes(role: Role): TokenScope[] {
  const scopes: TokenScope[] = [];
  switch (role) {
    case Role.ADMIN:
      scopes.push(TokenScope.ADMIN);
      break;
    case Role.USER:
      scopes.push(TokenScope.USER);
      break;
  }
  return scopes;
}

@Route('/api/v1/identity')
export class LoginController extends Controller {
  @Post('login')
  @SuccessResponse('200', 'OK')
  public async login(@Body() request: LoginRequestDto): Promise<AuthDto> {
    const result = await mediatrJs.send<AuthDto>(new Login(request));

    return result;
  }
}

@injectable()
export class LoginHandler implements IRequestHandler<Login, AuthDto> {
  constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}
  async handle(request: Login): Promise<AuthDto> {
    await loginValidations.validateAsync(request);

    const user = await this.userRepository.findUserByEmail(request.email);

    if (!user || !(await isPasswordMatch(request.password, user.password as string))) {
      throw new ApplicationException('Incorrect email or password');
    }

    const scopes = createTokenScopes(user.role);
    const token = await mediatrJs.send<AuthDto>(
      new GenerateToken({ email: user.email, userId: user.id, scopes })
    );

    return token;
  }
}
