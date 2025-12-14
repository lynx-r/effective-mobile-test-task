import { AuthDto } from '@auth/dtos/auth.dto';
import { Token } from '@auth/entities/token.entity';
import { TokenType } from '@auth/enums/token-type.enum';
import { IAuthRepository } from '@data/repositories/auth.repository';
import config from 'building-blocks/config/config';
import { TokenScope } from 'building-blocks/contracts/identity.contract';
import { IRequest, IRequestHandler } from 'building-blocks/mediatr-js/mediatr-js';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { inject, injectable } from 'tsyringe';

export class GenerateToken implements IRequest<AuthDto> {
  email: string;
  userId: number;
  scopes: TokenScope[];

  constructor(request: Partial<GenerateToken> = {}) {
    Object.assign(this, request);
  }
}

const validScopes = Object.values(TokenScope);
const generateTokenValidations = {
  params: Joi.object().keys({
    email: Joi.string().required(),
    userId: Joi.number().integer().required(),
    scopes: Joi.array().items(Joi.valid(...validScopes))
  })
};

const generateJwtToken = (
  email: string,
  userId: number,
  expires: number,
  type: TokenType,
  scopes: TokenScope[] = [],
  secret: string = config.jwt.secret
): string => {
  const payload = {
    email,
    userId,
    iat: moment().unix(),
    exp: expires,
    type,
    scopes
  };
  return jwt.sign(payload, secret);
};

@injectable()
export class GenerateTokenHandler implements IRequestHandler<GenerateToken, AuthDto> {
  constructor(@inject('IAuthRepository') private authRepository: IAuthRepository) {}

  async handle(request: GenerateToken): Promise<AuthDto> {
    await generateTokenValidations.params.validateAsync(request);

    const tokenScopes: TokenScope[] = request.scopes;

    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateJwtToken(
      request.email,
      request.userId,
      accessTokenExpires.unix(),
      TokenType.ACCESS,
      tokenScopes
    );

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateJwtToken(
      request.email,
      request.userId,
      refreshTokenExpires.unix(),
      TokenType.REFRESH,
      tokenScopes
    );

    await this.authRepository.createToken(
      new Token({
        token: accessToken,
        refreshToken: refreshToken,
        expires: accessTokenExpires.toDate(),
        type: TokenType.ACCESS,
        blacklisted: false,
        userId: request.userId,
        scopes: tokenScopes
      })
    );

    const result = {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate()
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate()
      }
    };

    return new AuthDto(result);
  }
}
