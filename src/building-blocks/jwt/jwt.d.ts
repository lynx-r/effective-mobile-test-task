import * as express from 'express';
import { TokenScope } from '../contracts/identity.contract';
export declare function expressAuthentication(request: express.Request, securityName: string, scopes?: TokenScope[]): Promise<any>;
