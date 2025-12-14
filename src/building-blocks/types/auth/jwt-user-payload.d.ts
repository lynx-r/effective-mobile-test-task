import * as jwt from 'jsonwebtoken';
import { TokenScope, TokenType } from '../../contracts/identity.contract';
export interface JwtUserPayload extends jwt.JwtPayload {
    email: string;
    userId: string;
    type: TokenType;
    scopes: TokenScope[];
}
