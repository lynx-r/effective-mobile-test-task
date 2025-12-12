import { TypeMapper } from 'ts-mapper';
import { ProfileDto } from './dtos/profile.dto';
import { Profile } from './entities/profile.entity';

export class Mapper extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<Profile, ProfileDto>()
      .map(
        (src) => src.id,
        (dest) => dest.id
      )
      .map(
        (src) => src.email,
        (dest) => dest.email
      )
      .map(
        (src) => src.userId,
        (dest) => dest.userId
      )
      .map(
        (src) => src.firstName,
        (dest) => dest.firstName
      )
      .map(
        (src) => src.middleName,
        (dest) => dest.middleName
      )
      .map(
        (src) => src.lastName,
        (dest) => dest.lastName
      )
      .map(
        (src) => src.birthday,
        (dest) => dest.birthday
      )
      .map(
        (src) => src.status,
        (dest) => dest.status
      )
      .map(
        (src) => src.createdAt,
        (dest) => dest.createdAt
      )
      .map(
        (src) => src?.updatedAt,
        (dest) => dest?.updatedAt
      );
  }
}

const mapper = new Mapper();

export default mapper;
