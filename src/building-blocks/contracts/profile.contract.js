"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileDto = void 0;
class ProfileDto {
    id;
    email;
    userId;
    firstName;
    middleName;
    lastName;
    birthday;
    status;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ProfileDto = ProfileDto;
//# sourceMappingURL=profile.contract.js.map