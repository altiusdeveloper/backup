"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.accessTokenSchema = new mongoose_1.default.Schema({
    token: { type: String, unique: true },
    clientId: String,
    userId: String,
});
const AccessTokenCollection = mongoose_1.default.model("AccessToken", exports.accessTokenSchema);
exports.default = AccessTokenCollection;
//# sourceMappingURL=AccessTokenCollection.js.map