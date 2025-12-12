import { IEvent } from '../types/core/event';

export class UserCreated implements IEvent {
  id: number;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  updatedAt?: Date;

  constructor(partial?: Partial<UserCreated>) {
    Object.assign(this, partial);
  }
}

export class UserBlocked implements IEvent {
  id: number;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  updatedAt?: Date;

  constructor(partial?: Partial<UserBlocked>) {
    Object.assign(this, partial);
  }
}

export enum Role {
  USER = 0,
  ADMIN = 1
}

export enum TokenScope {
  ADMIN = 'admin',
  USER = 'user'
}

export enum TokenType {
  ACCESS = 0,
  REFRESH = 1
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked'
}
