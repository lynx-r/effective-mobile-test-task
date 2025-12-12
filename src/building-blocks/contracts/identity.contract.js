"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.TokenType = exports.TokenScope = exports.Role = exports.UserBlocked = exports.UserCreated = void 0;
class UserCreated {
    id;
    email;
    role;
    status;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.UserCreated = UserCreated;
class UserBlocked {
    id;
    email;
    role;
    status;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.UserBlocked = UserBlocked;
var Role;
(function (Role) {
    Role[Role["USER"] = 0] = "USER";
    Role[Role["ADMIN"] = 1] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var TokenScope;
(function (TokenScope) {
    TokenScope["ADMIN"] = "admin";
    TokenScope["USER"] = "user";
})(TokenScope || (exports.TokenScope = TokenScope = {}));
var TokenType;
(function (TokenType) {
    TokenType[TokenType["ACCESS"] = 0] = "ACCESS";
    TokenType[TokenType["REFRESH"] = 1] = "REFRESH";
})(TokenType || (exports.TokenType = TokenType = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["BLOCKED"] = "blocked";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
//# sourceMappingURL=identity.contract.js.map