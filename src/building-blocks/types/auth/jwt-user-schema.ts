import Joi from 'joi';
import { TokenScope, TokenType } from '../../contracts/identity.contract';

const validScopes = Object.values(TokenScope);
const validTypes = Object.values(TokenType);

const jwtUserSchema = Joi.object({
  iss: Joi.string().optional(),
  sub: Joi.number().integer().optional(),
  aud: Joi.array()
    .items(Joi.string().valid(...validScopes))
    .optional(),
  exp: Joi.number().integer().optional(),
  nbf: Joi.number().integer().optional(),
  jti: Joi.string().optional(),
  iat: Joi.number().integer().optional(),
  type: Joi.string()
    .valid(...validTypes)
    .optional()
});

export default jwtUserSchema;
