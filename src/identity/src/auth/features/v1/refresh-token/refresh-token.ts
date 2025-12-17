import { AuthDto } from '@auth/dtos/auth.dto';
import { Token } from '@auth/entities/token.entity';
import { TokenType } from '@auth/enums/token-type.enum';
import { IAuthRepository } from '@data/repositories/auth.repository';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import UnauthorizedException from 'building-blocks/types/exception/unauthorized.exception';
import Joi from 'joi';
import { BodyProp, Controller, Post, Route, SuccessResponse } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { GenerateToken } from '../generate-token/generate-token';
import { ValidateToken } from '../validate-token/validate-token';

export class RefreshToken implements IRequest<RefreshToken> {
  refreshToken: string;

  constructor(request: Partial<RefreshToken> = {}) {
    Object.assign(this, request);
  }
}

const refreshTokenValidations = {
  params: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

@Route('/api/v1/identity')
export class RefreshTokenController extends Controller {
  @Post('refresh-token')
  @SuccessResponse('200', 'OK')
  public async refreshToken(@BodyProp() refreshToken: string): Promise<AuthDto> {
    const result = await mediatrJs.send<AuthDto>(new RefreshToken({ refreshToken: refreshToken }));

    return result;
  }
}

@injectable()
export class RefreshTokenHandler implements IRequestHandler<RefreshToken, AuthDto> {
  constructor(@inject('IAuthRepository') private authRepository: IAuthRepository) {}

  async handle(request: RefreshToken): Promise<AuthDto> {
    await refreshTokenValidations.params.validateAsync(request);

    try {
      const refreshTokenData = await mediatrJs.send<Token & { email: string }>(
        new ValidateToken({
          token: request.refreshToken,
          type: TokenType.REFRESH
        })
      );
      const { userId, scopes, email } = refreshTokenData;

      await this.authRepository.removeToken(refreshTokenData);

      const result = await mediatrJs.send<AuthDto>(new GenerateToken({ email, userId, scopes }));

      return result;
    } catch {
      throw new UnauthorizedException('Please authenticate');
    }
  }
}
