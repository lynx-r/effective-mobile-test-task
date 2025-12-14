import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { TokenScope } from '../contracts/identity.contract';
import { JwtUserPayload } from '../types/auth/jwt-user-payload';
import UnauthorizedException from '../types/exception/unauthorized.exception';
import { generateFakeJwt } from '../utils/encryption';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes: TokenScope[] = []
): Promise<any> {
  if (securityName === 'jwt') {
    let token = request.body.token || request.query.token || request.headers['x-access-token'];

    if (config.env == 'test') {
      token = await generateFakeJwt();
      request.headers.authorization = 'Bearer' + ' ' + token;
    }

    const authorizationHeader = request.headers['authorization'];

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      token = authorizationHeader.split(' ')[1];
    } else {
      return Promise.reject(new UnauthorizedException('Unauthorized'));
    }

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new UnauthorizedException('Unauthorized'));
      }
      jwt.verify(token, config.jwt.secret, function (err: any, decoded: JwtUserPayload) {
        if (err) {
          reject(new UnauthorizedException(`Unauthorized: ${err.message}`));
        } else {
          // Check if JWT contains all required scopes
          if (!!scopes.length) {
            let isScoped = false;
            for (const scope of scopes) {
              if (decoded?.scopes?.includes(scope)) {
                isScoped = true;
                break;
              }
            }
            if (isScoped) {
              request.user = decoded;
              resolve(decoded);
            } else {
              reject(
                new UnauthorizedException(`Unauthorized: JWT does not contain required scope.`)
              );
            }
          } else {
            resolve(decoded);
          }
        }
      });
    });
  }

  // If securityName is neither "api_key" nor "jwt", return a promise that rejects
  return Promise.reject(new UnauthorizedException('Unauthorized'));
}
