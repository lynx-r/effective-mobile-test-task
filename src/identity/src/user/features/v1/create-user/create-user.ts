import { IUserRepository } from '@data/repositories/user.repository';
import { UserDto } from '@user/dtos/user.dto';
import { User } from '@user/entities/user.entity';
import { Role } from '@user/enums/role.enum';
import mapper from '@user/mapping';
import { UserCreated } from 'building-blocks/contracts/identity.contract';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import { IPublisher } from 'building-blocks/rabbitmq/rabbitmq-publisher';
import ConflictException from 'building-blocks/types/exception/conflict.exception';
import { encryptPassword } from 'building-blocks/utils/encryption';
import { password } from 'building-blocks/utils/validation';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { Body, Controller, Post, Route, Security, SuccessResponse } from 'tsoa';
import { inject, injectable } from 'tsyringe';

export class CreateUser implements IRequest<UserDto> {
  email: string;
  password: string;
  role: Role;

  constructor(request: Partial<CreateUser> = {}) {
    Object.assign(this, request);
  }
}

export class CreateUserRequestDto {
  email: string;
  password: string;
  role: Role;

  constructor(request: Partial<CreateUserRequestDto> = {}) {
    Object.assign(this, request);
  }
}

export const createUserValidations = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  role: Joi.string().required().valid(Role.USER, Role.ADMIN)
});

@Route('/api/v1/user')
export class CreateUserController extends Controller {
  @Post('create')
  @Security('jwt', ['admin'])
  @SuccessResponse('201', 'CREATED')
  public async createUser(@Body() request: CreateUserRequestDto): Promise<UserDto> {
    const { email, password, role } = request;
    const result = await mediatrJs.send<UserDto>(
      new CreateUser({
        email,
        password,
        role
      })
    );

    this.setStatus(StatusCodes.CREATED);
    return result;
  }
}

@injectable()
export class CreateUserHandler implements IRequestHandler<CreateUser, UserDto> {
  constructor(
    @inject('IPublisher') private publisher: IPublisher,
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  async handle(request: CreateUser): Promise<UserDto> {
    await createUserValidations.validateAsync(request);

    const existUser = await this.userRepository.findUserByEmail(request.email);

    if (existUser) {
      throw new ConflictException('Email already taken');
    }

    const userEntity = await this.userRepository.createUser(
      new User({
        email: request.email,
        password: await encryptPassword(request.password),
        role: request.role
      })
    );

    await this.publisher.publishMessage(new UserCreated(userEntity));

    const result = mapper.map<User, UserDto>(userEntity, new UserDto());

    return result;
  }
}
