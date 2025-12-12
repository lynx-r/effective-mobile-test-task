import { Profile } from '@profile/entities/profile.entity';
import { Repository, SelectQueryBuilder } from 'building-blocks/typeorm';
import { DbContext } from 'building-blocks/typeorm/db-context';
import { container } from 'tsyringe';

export interface IProfileRepository {
  createProfile(profile: Profile): Promise<Profile>;

  findProfileById(id: number): Promise<Profile>;

  findProfileByUserId(userId: number): Promise<Profile>;

  findProfileByEmail(email: string): Promise<Profile>;

  findProfiles(
    page: number,
    pageSize: number,
    orderBy: string,
    order: 'ASC' | 'DESC',
    searchTerm?: string
  ): Promise<[Profile[], number]>;
}

export class ProfileRepository implements IProfileRepository {
  private ormRepository: Repository<Profile>;

  constructor() {
    this.ormRepository = container.resolve(DbContext).connection.getRepository(Profile);
  }

  async createProfile(profile: Profile): Promise<Profile> {
    return await this.ormRepository.save(profile);
  }

  async saveProfile(profile: Profile): Promise<Profile> {
    return await this.ormRepository.save(profile);
  }

  async findProfileById(id: number): Promise<Profile> {
    return this.ormRepository.findOneBy({ id });
  }

  async findProfileByUserId(userId: number): Promise<Profile> {
    return this.ormRepository.findOneBy({ userId });
  }

  async findProfileByEmail(email: string): Promise<Profile> {
    return this.ormRepository.findOneBy({ email });
  }

  async findProfiles(
    page: number,
    pageSize: number,
    orderBy: string,
    order: 'ASC' | 'DESC',
    searchTerm?: string
  ): Promise<[Profile[], number]> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const queryBuilder: SelectQueryBuilder<Profile> = this.ormRepository
      .createQueryBuilder('profile')
      .orderBy(`profile.${orderBy}`, order)
      .skip(skip)
      .take(take);

    // Apply filter criteria to the query
    if (searchTerm) {
      queryBuilder.andWhere('profile.name LIKE :name', { name: `%${searchTerm}%` });
    }

    return await queryBuilder.getManyAndCount();
  }

  async getAllProfiles(): Promise<Profile[]> {
    return await this.ormRepository.find();
  }
}
