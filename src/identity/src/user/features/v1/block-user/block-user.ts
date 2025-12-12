import { TokenType } from '@auth/enums/token-type.enum';
import { IAuthRepository } from '@data/repositories/auth.repository';
import { IUserRepository } from '@data/repositories/user.repository';
import { UserDto } from '@user/dtos/user.dto';
import { User } from '@user/entities/user.entity';
import { Role } from '@user/enums/role.enum';
import { UserBlocked, UserStatus } from 'building-blocks/contracts/identity.contract';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import { IPublisher } from 'building-blocks/rabbitmq/rabbitmq-publisher';
import ForbiddenException from 'building-blocks/types/exception/forbidden.exception';
import NotFoundException from 'building-blocks/types/exception/not-found.exception';
import UnauthorizedException from 'building-blocks/types/exception/unauthorized.exception';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { Controller, Header, Put, Query, Route, Security, SuccessResponse } from 'tsoa';
import { inject, injectable } from 'tsyringe';

export class BlockUser implements IRequest<UserDto> {
  id: number;
  authorization: string;

  constructor(request: Partial<BlockUser> = {}) {
    Object.assign(this, request);
  }
}

const blockUserValidations = Joi.object({
  id: Joi.number().required(),
  authorization: Joi.string().required()
});

@Route('/api/v1/user')
export class BlockUserController extends Controller {
  @Put('block')
  @Security('jwt')
  @SuccessResponse('204', 'NO_CONTENT')
  public async blockUser(@Header() authorization: string, @Query() id: number): Promise<void> {
    await mediatrJs.send(
      new BlockUser({
        id,
        authorization
      })
    );

    this.setStatus(StatusCodes.NO_CONTENT);
  }
}

@injectable()
export class BlockUserHandler implements IRequestHandler<BlockUser, any> {
  constructor(
    @inject('IAuthRepository') private authRepository: IAuthRepository,
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IPublisher') private publisher: IPublisher
  ) {}

  async handle(request: BlockUser): Promise<any> {
    await blockUserValidations.validateAsync(request);

    const blockingUser = await this.userRepository.findUserById(request.id);
    if (!blockingUser) {
      throw new NotFoundException('User not found');
    }

    const authorization = request.authorization;
    let token: string = '';
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    } else {
      throw new UnauthorizedException('Invalid header with jwt token');
    }

    const tokenEntity = await this.authRepository.findToken(token, TokenType.ACCESS);
    const userId = tokenEntity?.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authorized');
    }

    const currentUser = await this.userRepository.findUserById(userId);
    if (!(currentUser.role === Role.ADMIN || currentUser.id === blockingUser.id)) {
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
