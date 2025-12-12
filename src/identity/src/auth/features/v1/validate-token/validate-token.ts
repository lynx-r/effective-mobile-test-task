import { Token } from '@auth/entities/token.entity';
import { TokenType } from '@auth/enums/token-type.enum';
import { IAuthRepository } from '@data/repositories/auth.repository';
import config from 'building-blocks/config/config';
import { IRequest, IRequestHandler } from 'building-blocks/mediatr-js/mediatr-js';
import NotFoundException from 'building-blocks/types/exception/not-found.exception';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

export class ValidateToken implements IRequest<Token> {
  token: string;
  type: TokenType;

  constructor(request: Partial<ValidateToken> = {}) {
    Object.assign(this, request);
  }
}

const validateTokenValidations = Joi.object({
  token: Joi.string().required(),
  type: Joi.string().required().valid(TokenType.ACCESS, TokenType.REFRESH)
});

@injectable()
export class ValidateTokenHandler implements IRequestHandler<ValidateToken, Token> {
  constructor(@inject('IAuthRepository') private authRepository: IAuthRepository) {}

  async handle(request: ValidateToken): Promise<Token & { email: string }> {
    await validateTokenValidations.validateAsync(request);

    const payload = jwt.verify(request.token, config.jwt.secret);
    if (typeof payload === 'string') {
      throw new NotFoundException('Token not found');
    }
    const userId = +payload.sub;

    let token: Token = null;

    if (request.type == TokenType.REFRESH) {
      token = await this.authRepository.findRefreshTokenByUserId(request.token, userId, false);
    } else {
      token = await this.authRepository.findTokenByUserId(request.token, userId, false);
    }

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    return { ...token, email: payload.iss };
  }
}
