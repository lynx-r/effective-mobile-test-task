import { IProfileRepository } from '@data/repositories/profile.repository';
import { ProfileDto } from '@profile/dtos/profile.dto';
import { Profile } from '@profile/entities/profile.entity';
import mapper from '@profile/mappings';
import { TokenScope } from 'building-blocks/contracts/identity.contract';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import { JwtUserPayload } from 'building-blocks/types/auth/jwt-user-payload';
import jwtUserSchema from 'building-blocks/types/auth/jwt-user-schema';
import ForbiddenException from 'building-blocks/types/exception/forbidden.exception';
import NotFoundException from 'building-blocks/types/exception/not-found.exception';
import Joi from 'joi';
import { Controller, Get, Query, RequestProp, Route, Security, SuccessResponse } from 'tsoa';
import { inject, injectable } from 'tsyringe';

export class GetProfileById implements IRequest<ProfileDto> {
  id: number;
  user: JwtUserPayload;

  constructor(request: Partial<GetProfileById> = {}) {
    Object.assign(this, request);
  }
}

const getProfileByIdValidations = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
    user: jwtUserSchema
  })
};

@Route('/api/v1/profile')
export class GetProfileByIdController extends Controller {
  @Get('get-by-id')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  public async getProfileById(@RequestProp() user: any, @Query() id: number): Promise<ProfileDto> {
    const result = await mediatrJs.send<ProfileDto>(
      new GetProfileById({
        id,
        user
      })
    );

    if (!result) {
      throw new NotFoundException('Profile not found');
    }
    return result;
  }
}

@injectable()
export class GetProfileByIdHandler implements IRequestHandler<GetProfileById, ProfileDto> {
  constructor(@inject('IProfileRepository') private profileRepository: IProfileRepository) {}

  async handle(request: GetProfileById): Promise<ProfileDto> {
    await getProfileByIdValidations.params.validateAsync(request);

    const isAdmin = request.user?.scopes?.includes(TokenScope.ADMIN);
    const currentEmail = request.user?.email;

    const profileEntity = await this.profileRepository.findProfileById(request.id);
    if (!profileEntity) {
      return null;
    }

    if (!(isAdmin || profileEntity.email === currentEmail)) {
      throw new ForbiddenException('User not admin or himself');
    }

    const result = mapper.map<Profile, ProfileDto>(profileEntity, new ProfileDto());

    return result;
  }
}
