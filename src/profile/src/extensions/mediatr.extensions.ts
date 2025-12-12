import {
  GetProfileById,
  GetProfileByIdHandler
} from '@profile/features/v1/get-profile-by-id/get-profile-by-id';
import { GetProfiles, GetProfilesHandler } from '@profile/features/v1/get-profiles/get-profiles';
import { mediatrJs } from 'building-blocks/mediatr-js/mediatr-js';
import { container } from 'tsyringe';

export const registerMediatrHandlers = () => {
  mediatrJs.registerRequestHandler(new GetProfileById(), container.resolve(GetProfileByIdHandler));
  mediatrJs.registerRequestHandler(new GetProfiles(), container.resolve(GetProfilesHandler));
};
