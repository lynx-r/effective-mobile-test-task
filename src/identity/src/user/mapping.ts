import { TypeMapper } from 'ts-mapper';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';

export class Mapper extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<User, UserDto>()
      .map(
        (src) => src.role,
        (dest) => dest.role
      )
      .map(
        (src) => src.id,
        (dest) => dest.id
      )
      .map(
        (src) => src.email,
        (dest) => dest.email
      )
      .map(
        (src) => src?.updatedAt,
        (dest) => dest?.updatedAt
      )
      .map(
        (src) => src.createdAt,
        (dest) => dest.createdAt
      )
      .map(
        (src) => src.status,
        (dest) => dest.status
      );
  }
}

const mapper = new Mapper();

export default mapper;
