"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.articleSchema = new mongoose_1.default.Schema({
    author: String,
    title: String,
    content: String,
}, { timestamps: true });
const ArticleCollection = mongoose_1.default.model("Article", exports.articleSchema);
exports.default = ArticleCollection;
//# sourceMappingURL=ArticleCollection.js.map