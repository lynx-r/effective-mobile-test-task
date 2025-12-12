import { JwtUserPayload } from './jwt-user-payload';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}
