import { IProfileRepository } from '@data/repositories/profile.repository';
import { ProfileDto } from '@profile/dtos/profile.dto';
import { Profile } from '@profile/entities/profile.entity';
import mapper from '@profile/mappings';
import { IRequest, IRequestHandler, mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import { PagedResult } from 'building-blocks/types/pagination/paged-result';
import Joi from 'joi';
import { Controller, Get, Query, Route, Security, SuccessResponse } from 'tsoa';
import { inject, injectable } from 'tsyringe';

export class GetProfiles implements IRequest<PagedResult<ProfileDto[]>> {
  page = 1;
  pageSize = 10;
  orderBy = 'id';
  order: 'ASC' | 'DESC' = 'ASC';
  searchTerm?: string = null;

  constructor(request: Partial<GetProfiles> = {}) {
    Object.assign(this, request);
  }
}

const getProfilesValidations = Joi.object<GetProfiles>({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
  orderBy: Joi.string().valid('id', 'name', 'email').default('id'),
  order: Joi.string().valid('ASC', 'DESC').default('ASC'),
  searchTerm: Joi.string().allow(null).optional()
});

@Route('/api/v1/profile')
export class GetProfilesController extends Controller {
  @Get('get-all')
  @Security('jwt', ['admin'])
  @SuccessResponse('200', 'OK')
  public async getProfiles(
    @Query() pageSize = 10,
    @Query() page = 1,
    @Query() order: 'ASC' | 'DESC' = 'ASC',
    @Query() orderBy = 'id',
    @Query() searchTerm?: string
  ): Promise<ProfileDto[]> {
    const result = await mediatrJs.send<ProfileDto[]>(
      new GetProfiles({
        page: page,
        pageSize: pageSize,
        searchTerm: searchTerm,
        order: order,
        orderBy: orderBy
      })
    );

    return result;
  }
}

@injectable()
export class GetProfilesHandler implements IRequestHandler<GetProfiles, PagedResult<ProfileDto[]>> {
  constructor(@inject('IProfileRepository') private profileRepository: IProfileRepository) {}

  async handle(request: GetProfiles): Promise<PagedResult<ProfileDto[]>> {
    await getProfilesValidations.validateAsync(request);

    const [profilesEntity, total] = await this.profileRepository.findProfiles(
      request.page,
      request.pageSize,
      request.orderBy,
      request.order,
      request.searchTerm
    );

    if (profilesEntity?.length == 0) return new PagedResult<ProfileDto[]>(null, total);

    const result = profilesEntity.map((user) =>
      mapper.map<Profile, ProfileDto>(user, new ProfileDto())
    );

    return new PagedResult<ProfileDto[]>(result, total);
  }
}
