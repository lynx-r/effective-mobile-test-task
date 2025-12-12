import { TokenType } from '@auth/enums/token-type.enum';
import { User } from '@user/entities/user.entity';
import { TokenScope } from 'building-blocks/contracts/identity.contract';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'building-blocks/typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  refreshToken: string;

  @Column()
  expires: Date;

  @Column({
    type: 'enum',
    enum: TokenType,
    default: TokenType.ACCESS
  })
  type: TokenType;

  @Column()
  blacklisted: boolean;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.tokens)
  user?: User;

  @Column()
  userId: number;

  @Column('text', { array: true })
  scopes: TokenScope[];

  constructor(partial?: Partial<Token>) {
    Object.assign(this, partial);
    this.createdAt = partial?.createdAt ?? new Date();
  }
}
