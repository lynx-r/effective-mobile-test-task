import { IUserRepository } from '@data/repositories/user.repository';
import { UserDto } from '@user/dtos/user.dto';
import { User } from '@user/entities/user.entity';
import mapper from '@user/mapping';
import { TokenScope } from 'building-blocks/contracts/identity.contract';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import { JwtUserPayload } from 'building-blocks/types/auth/jwt-user-payload';
import jwtUserSchema from 'building-blocks/types/auth/jwt-user-schema';
import ForbiddenException from 'building-blocks/types/exception/forbidden.exception';
import NotFoundException from 'building-blocks/types/exception/not-found.exception';
import Joi from 'joi';
import { Controller, Get, Query, RequestProp, Route, Security, SuccessResponse } from 'tsoa';
import { inject, injectable } from 'tsyringe';

export class GetUserById implements IRequest<UserDto> {
  id: number;
  user: JwtUserPayload;

  constructor(request: Partial<GetUserById> = {}) {
    Object.assign(this, request);
  }
}

const getUserByIdValidations = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
    user: jwtUserSchema
  })
};

@Route('/api/v1/user')
export class GetUserByIdController extends Controller {
  @Get('get-by-id')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  public async getUserById(@RequestProp() user: any, @Query() id: number): Promise<UserDto> {
    const result = await mediatrJs.send<UserDto>(
      new GetUserById({
        id,
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
export class GetUserByIdHandler implements IRequestHandler<GetUserById, UserDto> {
  constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}
  async handle(request: GetUserById): Promise<UserDto> {
    await getUserByIdValidations.params.validateAsync(request);

    const isAdmin = request.user.aud?.includes(TokenScope.ADMIN);
    const userId = +request.user.sub;

    const userEntity = await this.userRepository.findUserById(request.id);
    if (!userEntity) {
      return null;
    }

    if (!(isAdmin || userEntity.id === userId)) {
      throw new ForbiddenException('User not admin or himself');
    }

    const result = mapper.map<User, UserDto>(userEntity, new UserDto());

    return result;
  }
}
