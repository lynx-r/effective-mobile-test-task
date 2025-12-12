import { IEvent } from '../types/core/event';
export declare class UserCreated implements IEvent {
    id: number;
    email: string;
    role: Role;
    status: UserStatus;
    createdAt: Date;
    updatedAt?: Date;
    constructor(partial?: Partial<UserCreated>);
}
export declare class UserBlocked implements IEvent {
    id: number;
    email: string;
    role: Role;
    status: UserStatus;
    createdAt: Date;
    updatedAt?: Date;
    constructor(partial?: Partial<UserBlocked>);
}
export declare enum Role {
    USER = 0,
    ADMIN = 1
}
export declare enum TokenScope {
    ADMIN = "admin",
    USER = "user"
}
export declare enum TokenType {
    ACCESS = 0,
    REFRESH = 1
}
export declare enum UserStatus {
    ACTIVE = "active",
    BLOCKED = "blocked"
}
