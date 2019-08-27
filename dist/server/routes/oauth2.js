"use strict";
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
// The Spec of OAuth2 defined 4 roles, which are user, resource server, client and authorization server.
// This file lists all routes of **authorization server**
const express_1 = __importDefault(require("express"));
const controllers = __importStar(require("../controllers/oauth2"));
const passport = require("passport");
const oauth2 = express_1.default.Router();
oauth2.route("/token").post(controllers.token);
oauth2.route("/authorize").get(controllers.authorization);
oauth2.route("/authorize/decision").post(controllers.decision);
oauth2.route("/signup").post(controllers.signUp);
oauth2.route("/login").post(controllers.logIn);
oauth2.route("/profile")
    .get(passport.authenticate("bearer", { session: false }), controllers.profile)
    .post(passport.authenticate("bearer", { session: false }), controllers.updateProfile);
exports.default = oauth2;
//# sourceMappingURL=oauth2.js.map