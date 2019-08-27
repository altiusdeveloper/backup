"use strict";
// This module is modified from
// The Spec of OAuth2 defined 4 roles, which are user, resource server, client and authorization server.
// This file is part of **authorization server**
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const oauth2orize_1 = __importDefault(require("oauth2orize"));
require("./passport-provider");
const ClientCollection_1 = __importDefault(require("../models/OAuth/ClientCollection"));
const AuthCodeCollection_1 = __importDefault(require("../models/OAuth/AuthCodeCollection"));
const AccessTokenCollection_1 = __importDefault(require("../models/OAuth/AccessTokenCollection"));
const random = __importStar(require("../util/random"));
const UserCollection_1 = __importDefault(require("../models/User/UserCollection"));
// Create OAuth 2.0 server
const server = oauth2orize_1.default.createServer();
// Function to issue and save a new access token
const issueToken = (clientId, userId, done) => {
    console.log("[issue token]");
    const token = random.getUid(256);
    const accessToken = new AccessTokenCollection_1.default({
        token: token,
        clientId: clientId,
        userId: userId
    });
    accessToken.save((error, accessToken) => {
        if (error) {
            return done(error, undefined);
        }
        return done(undefined, accessToken.token);
    });
};
// Register serialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated. To complete the transaction, the
// user must authenticate and approve the authorization request. Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session. Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.
server.serializeClient((client, done) => done(undefined, client.id));
server.deserializeClient((id, done) => {
    done(undefined, ClientCollection_1.default.find((client) => client.id === id));
});
// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources. It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.
// Grant authorization codes. The callback takes the `client` requesting
// authorization, the `redirectUri` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application. The application issues a code, which is bound to these
// values, and will be exchanged for an access token.
server.grant(oauth2orize_1.default.grant.code((client, redirectUri, user, res, issued) => {
    console.log("[oauth2orize.grant.code]");
    const code = random.getUid(16);
    const authCode = new AuthCodeCollection_1.default({
        code: code,
        clientId: client.id,
        userId: user.id,
        userName: user.name,
        redirectUri: redirectUri
    });
    authCode.save((error, authCode) => {
        if (error) {
            return issued(error, undefined);
        }
        return issued(undefined, authCode.code);
    });
}));
// Grant implicit authorization. The callback takes the `client` requesting
// authorization, the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application. The application issues a token, which is bound to these
// values.
server.grant(oauth2orize_1.default.grant.token((client, user, res, done) => {
    console.log("[oauth2orize.grant.token]");
    issueToken(client.id, user.id, done);
}));
// Exchange authorization codes for access tokens. The callback accepts the
// `client`, which is exchanging `code` and any `redirectUri` from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code. The issued access token response can include a refresh token and
// custom parameters by adding these to the `done()` call
server.exchange(oauth2orize_1.default.exchange.code((client, code, redirectUri, done) => {
    console.log("[oauth2orize.exchange.code]");
    AuthCodeCollection_1.default.findOne({ code: code }, (error, authCode) => {
        if (error) {
            return done(error);
        }
        if (client.id !== authCode.clientId) {
            return done(undefined, false);
        }
        if (redirectUri !== authCode.redirectUri) {
            return done(undefined, false);
        }
        // Everything validated, return the token
        issueToken(client.id, authCode.userId, done);
    });
}));
// Exchange user id and password for access tokens. The callback accepts the
// `client`, which is exchanging the user's name and password from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the code.
server.exchange(oauth2orize_1.default.exchange.password((client, email, password, scope, done) => {
    console.log("[oauth2orize.exchange.password]");
    // Validate the client
    const foundClient = ClientCollection_1.default.find((value) => client.id === value.id);
    if (!foundClient || foundClient.secret !== client.secret) {
        return done(undefined, false);
    }
    // Validate the user
    UserCollection_1.default.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(undefined, false);
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(undefined, false);
            }
            // Everything validated, return the token
            issueToken(client.id, user.id, done);
        });
    });
}));
// Exchange the client id and password/secret for an access token. The callback accepts the
// `client`, which is exchanging the client's id and password/secret from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the client who authorized the code.
server.exchange(oauth2orize_1.default.exchange.clientCredentials((client, scope, done) => {
    console.log("[oauth2orize.exchange.clientCredentials]");
    // Validate the client
    const foundClient = ClientCollection_1.default.find((value) => client.id === value.id);
    if (!foundClient || foundClient.secret !== client.secret) {
        return done(undefined, false);
    }
    // Everything validated, return the token
    issueToken(client.id, undefined, done);
}));
exports.default = server;
//# sourceMappingURL=oauth2orize-server.js.map