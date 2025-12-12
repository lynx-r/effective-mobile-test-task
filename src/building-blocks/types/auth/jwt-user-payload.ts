import * as jwt from 'jsonwebtoken';
import { TokenType } from '../../contracts/identity.contract';

export interface JwtUserPayload extends jwt.JwtPayload {
  type: TokenType;
}
