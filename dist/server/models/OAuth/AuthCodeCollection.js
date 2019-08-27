"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.authCodeSchema = new mongoose_1.default.Schema({
    code: { type: String, unique: true },
    clientId: String,
    userId: String,
    userName: String,
    redirectUri: String,
});
const AuthCodeCollection = mongoose_1.default.model("AuthCode", exports.authCodeSchema);
exports.default = AuthCodeCollection;
//# sourceMappingURL=AuthCodeCollection.js.map