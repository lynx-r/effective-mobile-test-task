import { IUserRepository } from '@data/repositories/user.repository';
import { UserDto } from '@user/dtos/user.dto';
import { User } from '@user/entities/user.entity';
import { TokenScope, UserBlocked, UserStatus } from 'building-blocks/contracts/identity.contract';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import { IPublisher } from 'building-blocks/rabbitmq/rabbitmq-publisher';
import { JwtUserPayload } from 'building-blocks/types/auth/jwt-user-payload';
import jwtUserSchema from 'building-blocks/types/auth/jwt-user-schema';
import ForbiddenException from 'building-blocks/types/exception/forbidden.exception';
import NotFoundException from 'building-blocks/types/exception/not-found.exception';
import UnauthorizedException from 'building-blocks/types/exception/unauthorized.exception';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { Controller, Put, Query, RequestProp, Route, Security, SuccessResponse } from 'tsoa';
import { inject, injectable } from 'tsyringe';

export class BlockUser implements IRequest<UserDto> {
  id: number;
  user: JwtUserPayload;

  constructor(request: Partial<BlockUser> = {}) {
    Object.assign(this, request);
  }
}

const blockUserValidations = Joi.object({
  id: Joi.number().required(),
  user: jwtUserSchema
});

@Route('/api/v1/user')
export class BlockUserController extends Controller {
  @Put('block')
  @Security('jwt')
  @SuccessResponse('204', 'NO_CONTENT')
  public async blockUser(@RequestProp() user: any, @Query() id: number): Promise<void> {
    await mediatrJs.send(
      new BlockUser({
        id,
        user
      })
    );

    this.setStatus(StatusCodes.NO_CONTENT);
  }
}

@injectable()
export class BlockUserHandler implements IRequestHandler<BlockUser, any> {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IPublisher') private publisher: IPublisher
  ) {}

  async handle(request: BlockUser): Promise<any> {
    await blockUserValidations.validateAsync(request);

    const blockingUser = await this.userRepository.findUserById(request.id);
    if (!blockingUser) {
      throw new NotFoundException('User not found');
    }

    const isAdmin = request.user?.scopes?.includes(TokenScope.ADMIN);
    const userId = +request.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authorized');
    }

    if (!(isAdmin || userId === blockingUser.id)) {
      throw new ForbiddenException('User not admin or himself');
    }

    const blockedUserEntity = new User({
      ...blockingUser,
      status: UserStatus.BLOCKED,
      updatedAt: new Date()
    });

    await this.userRepository.updateUser(blockedUserEntity);

    await this.publisher.publishMessage(new UserBlocked(blockedUserEntity));
  }
}
