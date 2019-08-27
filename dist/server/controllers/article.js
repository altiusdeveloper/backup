"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArticleCollection_1 = __importDefault(require("../models/Article/ArticleCollection"));
const UserCollection_1 = __importDefault(require("../models/User/UserCollection"));
exports.remove = (req, res, next) => {
    ArticleCollection_1.default.findById(req.params.id).exec((error, article) => {
        if (error) {
            return next(error);
        }
        if (!article) {
            return res.status(404).json({ message: "Not Found" });
        }
        if (article.author !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not the author!" });
        }
        ArticleCollection_1.default.findByIdAndRemove(req.params.id).exec((error, removed) => {
            if (error) {
                return next(error);
            }
            res.status(200).end();
        });
    });
};
exports.update = (req, res, next) => {
    req.assert("content", "Content cannot be empty.").notEmpty();
    req.assert("content", "Content should be longer than 500 characters.").len({ min: 500 });
    req.assert("title", "Title cannot be empty.").notEmpty();
    req.assert("title", "Title cannot be longer than 100 characters.").len({ max: 100 });
    const errors = req.validationErrors();
    if (errors && errors.length > 0) {
        return res.status(400).json({ message: errors[0].msg });
    }
    ArticleCollection_1.default.findById(req.body._id).exec((error, article) => {
        if (error) {
            return next(error);
        }
        if (!article) {
            return res.status(404).json({ message: "Not Found" });
        }
        if (article.author !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not the author!" });
        }
        ArticleCollection_1.default.findByIdAndUpdate(req.body._id, { content: req.body.content, title: req.body.title }).exec((error, updated) => {
            if (error) {
                return next(error);
            }
            res.status(200).end();
        });
    });
};
exports.create = (req, res, next) => {
    req.assert("author", "Malicious attack is detected.").equals(req.user._id.toString());
    req.assert("content", "Content cannot be empty.").notEmpty();
    req.assert("content", "Content should be longer than 500 characters.").len({ min: 500 });
    req.assert("title", "Title cannot be empty.").notEmpty();
    req.assert("title", "Title cannot be longer than 100 characters.").len({ max: 100 });
    const errors = req.validationErrors();
    if (errors && errors.length > 0) {
        return res.status(400).json({ message: errors[0].msg });
    }
    const article = new ArticleCollection_1.default({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
    });
    article.save((error) => {
        if (error) {
            return next(error);
        }
        res.status(200).send();
    });
};
exports.read = (req, res, next) => {
    ArticleCollection_1.default.find({}).exec((error, articles) => {
        if (error) {
            next(error);
        }
        const findAuthorInUsers = (article) => {
            return UserCollection_1.default.findById(article.author).exec();
        };
        const promises = articles.map((article) => __awaiter(this, void 0, void 0, function* () {
            const user = yield findAuthorInUsers(article);
            return {
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                gender: user.gender,
                _id: user._id.toString()
            };
        }));
        Promise.all(promises).then((authors) => {
            const authorsDic = {};
            authors.forEach((author) => {
                authorsDic[author._id] = author;
            });
            res.json({ data: articles, authors: authorsDic });
        });
    });
};
//# sourceMappingURL=article.js.map