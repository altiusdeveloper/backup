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
// This file lists all routes of **resource server**
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const controllers = __importStar(require("../controllers/auth"));
const auth = express_1.default.Router();
auth.route("/oauth2").get(passport_1.default.authenticate("oauth2"));
auth.route("/oauth2/callback").get(controllers.oauth2Callback);
exports.default = auth;
//# sourceMappingURL=auth.js.map