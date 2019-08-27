"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// The Spec of OAuth2 defined 4 roles.
// They are user, resource server, client and authorization server.
// This file is part of **authorization server**
const passport_1 = __importDefault(require("passport"));
const UserCollection_1 = __importDefault(require("../models/User/UserCollection"));
const passport_local_1 = require("passport-local");
const passport_http_1 = require("passport-http");
const passport_oauth2_client_password_1 = require("passport-oauth2-client-password");
const passport_http_bearer_1 = require("passport-http-bearer");
const ClientCollection_1 = __importDefault(require("../models/OAuth/ClientCollection"));
const AccessTokenCollection_1 = __importDefault(require("../models/OAuth/AccessTokenCollection"));
passport_1.default.serializeUser((user, done) => {
    done(undefined, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    UserCollection_1.default.findById(id, (err, user) => {
        done(err, user);
    });
});
/**
 * Sign in using Email and Password.
 */
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email" }, (email, password, done) => {
    console.log("[LocalStrategy] applied, email: " + email + " and password: " + password);
    UserCollection_1.default.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done({ message: `Email ${email} not found.` }, false);
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done({ message: "Password is incorrect." }, false);
        });
    });
}));
/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients. They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens. The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate. Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header). While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
function verifyClient(clientId, clientSecret, done) {
    console.log("[ClientPasswordStrategy] applied, clientId: " + clientId + " and clientSecret: " + clientSecret);
    const client = ClientCollection_1.default.find((value) => value.id === clientId);
    if (!client || client.secret !== clientSecret) {
        return done(undefined, false);
    }
    return done(undefined, client);
}
passport_1.default.use(new passport_http_1.BasicStrategy(verifyClient));
passport_1.default.use(new passport_oauth2_client_password_1.Strategy(verifyClient));
/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token). If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport_1.default.use(new passport_http_bearer_1.Strategy((accessToken, done) => {
    console.log("[BearerStrategy] applied, accessToken: " + accessToken);
    AccessTokenCollection_1.default.findOne({ token: accessToken }, (error, token) => {
        if (error)
            return done(error);
        if (!token)
            return done(undefined, false);
        if (token.userId) {
            UserCollection_1.default.findById(token.userId, (error, user) => {
                if (error)
                    return done(error);
                if (!user)
                    return done(undefined, false);
                // To keep this example simple, restricted scopes are not implemented,
                // and this is just for illustrative purposes.
                done(undefined, user, { scope: "all", message: undefined });
            });
        }
        else {
            // The request came from a client only since userId is null,
            // therefore the client is passed back instead of a user.
            const client = ClientCollection_1.default.find((value) => value.id === token.clientId);
            if (!client)
                return done(undefined, false);
            // To keep this example simple, restricted scopes are not implemented,
            // and this is just for illustrative purposes.
            done(undefined, client, { scope: "all", message: undefined });
        }
    });
}));
//# sourceMappingURL=passport-provider.js.map