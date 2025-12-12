import { UserDto } from '@/user/dtos/user.dto';
import { mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import { StatusCodes } from 'http-status-codes';
import { Body, Controller, Post, Route, SuccessResponse } from 'tsoa';
import { CreateUser, CreateUserRequestDto } from '../create-user/create-user';

@Route('/api/v1/user')
export class RegisterUserController extends Controller {
  @Post('register')
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
