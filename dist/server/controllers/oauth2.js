"use strict";
// The Spec of OAuth2 defined 4 roles. They are user, resource server, client and authorization server.
// All request handlers of **authorization server** are located in this file.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oauth2orize_server_1 = __importDefault(require("../config/oauth2orize-server"));
const passport_1 = __importDefault(require("passport"));
const connect_ensure_login_1 = __importDefault(require("connect-ensure-login"));
const ClientCollection_1 = __importDefault(require("../models/OAuth/ClientCollection"));
const AccessTokenCollection_1 = __importDefault(require("../models/OAuth/AccessTokenCollection"));
const UserCollection_1 = __importDefault(require("../models/User/UserCollection"));
const Gender_1 = __importDefault(require("../../client/src/models/Gender"));
const secrets_1 = require("../util/secrets");
const storage_1 = __importDefault(require("../repository/storage"));
// User authorization endpoint.
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request. In
// doing so, is recommended that the `redirectUri` be checked against a
// registered value, although security requirements may vary across
// implementations. Once validated, the `done` callback must be invoked with
// a `client` instance, as well as the `redirectUri` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction. It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization). We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view.
exports.authorization = [
    connect_ensure_login_1.default.ensureLoggedIn(),
    oauth2orize_server_1.default.authorization((clientId, redirectUri, done) => {
        // Validate the client
        const client = ClientCollection_1.default.find((value) => clientId === value.id);
        if (!client) {
            done(new Error("Invalid client!"));
        }
        if (client.redirectUri !== redirectUri) {
            done(new Error("Incorrect redirectUri!"));
        }
        return done(undefined, client, redirectUri);
    }, (client, user, scope, type, areq, done) => {
        AccessTokenCollection_1.default.findOne({ clientId: client.id, userId: user.id }, (error, accessToken) => {
            if (accessToken) {
                // Auto-approve
                done(undefined, true, user, undefined);
            }
            else {
                done(undefined, false, user, undefined);
            }
        });
    }),
    function (req, res) {
        res.redirect(302, `${secrets_1.APP_URL}/consent?email=${req.user.email}&client_name=${req.oauth2.client.name}&transactionID=${req.oauth2.transactionID}`);
    }
];
// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.
exports.decision = [
    connect_ensure_login_1.default.ensureLoggedIn(),
    oauth2orize_server_1.default.decision()
];
// Token endpoint.
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens. Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request. Clients must
// authenticate when making requests to this endpoint.
exports.token = [
    passport_1.default.authenticate(["basic", "oauth2-client-password"], { session: false }),
    oauth2orize_server_1.default.token(),
    oauth2orize_server_1.default.errorHandler(),
];
/**
 * Create a new oauth2 user account.
 */
exports.signUp = (req, res, next) => {
    req.assert("email", "Email is not valid.").isEmail();
    req.assert("password", "Password must be at least 4 characters long.").len({ min: 4 });
    req.assert("confirmPassword", "Passwords do not match.").equals(req.body.password);
    req.assert("name", "Name cannot be blank.").notEmpty();
    req.assert("gender", "Gender is incorrect.").isIn(Object.values(Gender_1.default));
    req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });
    // TODO: Validate more fields, and respond the error correctly
    // We only pick an error for user each time
    const errors = req.validationErrors();
    if (errors && errors.length > 0) {
        return res.status(400).json({ message: errors[0].msg });
    }
    const user = new UserCollection_1.default({
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        name: req.body.name,
        address: req.body.address,
        avatarUrl: req.body.avatarUrl
    });
    UserCollection_1.default.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res.status(409).json({ message: "Account with that email address already exists." });
        }
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect(302, "/auth/oauth2"); // Get access token
            });
        });
    });
};
/**
 * Sign in using email and password.
 */
exports.logIn = (req, res, next) => {
    req.assert("email", "Email is not valid.").isEmail();
    req.assert("password", "Password cannot be blank.").notEmpty();
    req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });
    // We only pick an error for user each time
    const errors = req.validationErrors();
    if (errors && errors.length > 0) {
        return res.status(400).json({ message: errors[0].msg });
    }
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(401).json({ message: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: "Login failed." });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(401).json({ message: "Login failed." });
            }
            res.redirect(302, "/auth/oauth2"); // Get access token
        });
    })(req, res, next);
};
exports.profile = (req, res, next) => {
    return res.json({ user: req.user });
};
exports.updateProfile = (req, res, next) => {
    req.assert("email", "Malicious attack is detected.").equals(req.user.email);
    req.assert("_id", "Malicious attack is detected.").equals(req.user._id.toString());
    req.assert("name", "Name cannot be blank.").notEmpty();
    if (process.env.NODE_ENV === "production") {
        req.assert("avatarUrl", "Invalid url.").isURL();
    }
    req.assert("gender", "Gender is incorrect.").isIn(Object.values(Gender_1.default));
    const errors = req.validationErrors();
    if (errors && errors.length > 0) {
        return res.status(400).json({ message: errors[0].msg });
    }
    UserCollection_1.default.findById(req.body._id, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(404).json({ message: "Account cannot be found." });
        }
        Object.assign(user, req.body);
        user.save((err) => {
            if (err) {
                return res.status(500).json({ message: "Update failed." });
            }
            user.avatarUrl = `${user.avatarUrl}?${storage_1.default.generateSigningUrlParams()}`;
            res.json(user);
        });
    });
};
//# sourceMappingURL=oauth2.js.map