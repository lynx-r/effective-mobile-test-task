import { UserStatus } from 'building-blocks/contracts/identity.contract';
import { Column, Entity, PrimaryGeneratedColumn } from 'building-blocks/typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: 0 })
  userId: number;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  birthday?: Date | null;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column()
  createdAt: Date;

  @Column({ nullable: true }) // Making 'updatedAt' nullable
  updatedAt?: Date | null; // You can use 'Date | null' to allow null values

  constructor(partial?: Partial<Profile>) {
    Object.assign(this, partial);
    this.createdAt = partial?.createdAt ?? new Date();
  }

  formatFullName() {
    const { firstName, lastName, middleName } = this;
    const parts = [lastName, firstName, middleName].filter((part) => part && part.trim() !== '');
    return parts.join(' ');
  }
}
