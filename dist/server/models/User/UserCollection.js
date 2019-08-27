"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const mongoose_1 = __importDefault(require("mongoose"));
const storage_1 = __importDefault(require("../../repository/storage"));
exports.userSchema = new mongoose_1.default.Schema({
    email: { type: String, unique: true },
    password: String,
    name: String,
    gender: String,
    address: String,
    website: String,
    avatarUrl: String
}, { timestamps: true });
/**
 * Password hashing & Signing Url middleware.
 */
exports.userSchema.pre("save", function save(next) {
    const user = this;
    // Stripe signing params for Avatar Url
    if (user && user.avatarUrl) {
        const sasAvatarUrl = user.avatarUrl;
        user.avatarUrl = sasAvatarUrl.substring(0, sasAvatarUrl.indexOf("?"));
    }
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt_nodejs_1.default.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt_nodejs_1.default.hash(user.password, salt, undefined, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
exports.userSchema.post("findOne", function findOne(user, next) {
    // Add signing params for Avatar Url so that client can consume
    if (user && user.avatarUrl) {
        user.avatarUrl = `${user.avatarUrl}?${storage_1.default.generateSigningUrlParams()}`;
    }
    next();
});
const comparePassword = function (candidatePassword, cb) {
    bcrypt_nodejs_1.default.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};
exports.userSchema.methods.comparePassword = comparePassword;
const UserCollection = mongoose_1.default.model("User", exports.userSchema);
exports.default = UserCollection;
//# sourceMappingURL=UserCollection.js.map