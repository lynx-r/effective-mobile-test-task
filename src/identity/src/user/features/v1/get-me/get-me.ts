import { IUserRepository } from '@data/repositories/user.repository';
import { UserDto } from '@user/dtos/user.dto';
import { User } from '@user/entities/user.entity';
import mapper from '@user/mapping';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import { JwtUserPayload } from 'building-blocks/types/auth/jwt-user-payload';
import jwtUserSchema from 'building-blocks/types/auth/jwt-user-schema';
import NotFoundException from 'building-blocks/types/exception/not-found.exception';
import Joi from 'joi';
import { Controller, Get, RequestProp, Route, Security, SuccessResponse } from 'tsoa';
import { inject, injectable } from 'tsyringe';

export class GetMeByAuthorization implements IRequest<UserDto> {
  user: JwtUserPayload;

  constructor(request: Partial<GetMeByAuthorization> = {}) {
    Object.assign(this, request);
  }
}

const getMeByAuthorizationValidations = {
  params: Joi.object().keys({
    user: jwtUserSchema
  })
};

@Route('/api/v1/user')
export class GetMeController extends Controller {
  @Get('get-me')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  public async getUserById(@RequestProp() user: any): Promise<UserDto> {
    const result = await mediatrJs.send<UserDto>(
      new GetMeByAuthorization({
        user
      })
    );

    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }
}

@injectable()
export class GetMeHandler implements IRequestHandler<GetMeByAuthorization, UserDto> {
  constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}
  async handle(request: GetMeByAuthorization): Promise<UserDto> {
    await getMeByAuthorizationValidations.params.validateAsync(request);

    const userId = +request.user.sub;

    const userEntity = await this.userRepository.findUserById(userId);
    if (!userEntity) {
      return null;
    }

    const result = mapper.map<User, UserDto>(userEntity, new UserDto());

    return result;
  }
}
