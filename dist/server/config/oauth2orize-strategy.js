"use strict";
// All resource server who would like to authorize from the oauth2orize server
// must use this strategy instead of OAuth2Strategy
// The Spec of OAuth2 defined 4 roles, which are user, resource server, client and authorization server.
// This file is part of **authorization server**
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_oauth2_1 = __importDefault(require("passport-oauth2"));
const AccessTokenCollection_1 = __importDefault(require("../models/OAuth/AccessTokenCollection"));
const UserCollection_1 = __importDefault(require("../models/User/UserCollection"));
passport_oauth2_1.default.prototype.userProfile = (token, done) => {
    AccessTokenCollection_1.default.findOne({ token: token }, (error, accessToken) => {
        if (error || !accessToken) {
            done(error);
        }
        UserCollection_1.default.findById(accessToken.userId, (error, user) => {
            if (error || !user) {
                done(error);
            }
            done(undefined, user);
        });
    });
};
exports.default = passport_oauth2_1.default;
//# sourceMappingURL=oauth2orize-strategy.js.map