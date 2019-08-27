"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
exports.oauth2Callback = (req, res, next) => {
    passport_1.default.authenticate("oauth2", (error, user, info) => {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({ user: user, accessToken: info.accessToken });
        });
    })(req, res, next);
};
//# sourceMappingURL=auth.js.map