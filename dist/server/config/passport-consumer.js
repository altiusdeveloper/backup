"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// The Spec of OAuth2 defined 4 roles including user, resource server, client and authorization server.
// This file is part of **resource server**
const passport_1 = __importDefault(require("passport"));
const oauth2orize_strategy_1 = __importDefault(require("./oauth2orize-strategy"));
const ClientCollection_1 = __importDefault(require("../models/OAuth/ClientCollection"));
const secrets_1 = require("../util/secrets");
passport_1.default.use("oauth2", new oauth2orize_strategy_1.default({
    authorizationURL: `${secrets_1.APP_URL}/oauth2/authorize`,
    tokenURL: `${secrets_1.APP_URL}/oauth2/token`,
    clientID: ClientCollection_1.default[0].id,
    clientSecret: ClientCollection_1.default[0].secret,
    callbackURL: ClientCollection_1.default[0].redirectUri
}, (accessToken, refreshToken, user, verified) => {
    console.log("[OAuth2Strategy] applied, accessToken: " + accessToken + " and user: " + JSON.stringify(user));
    verified(undefined, user, { accessToken: accessToken });
}));
//# sourceMappingURL=passport-consumer.js.map