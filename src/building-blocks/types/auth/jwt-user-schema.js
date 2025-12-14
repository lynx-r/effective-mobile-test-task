"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const identity_contract_1 = require("../../contracts/identity.contract");
const validScopes = Object.values(identity_contract_1.TokenScope);
const validTypes = Object.values(identity_contract_1.TokenType);
const jwtUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().optional(),
    userId: joi_1.default.number().integer().optional(),
    scopes: joi_1.default.array()
        .items(joi_1.default.string().valid(...validScopes))
        .optional(),
    exp: joi_1.default.number().integer().optional(),
    nbf: joi_1.default.number().integer().optional(),
    jti: joi_1.default.string().optional(),
    iat: joi_1.default.number().integer().optional(),
    type: joi_1.default.string()
        .valid(...validTypes)
        .optional()
});
exports.default = jwtUserSchema;
//# sourceMappingURL=jwt-user-schema.js.map