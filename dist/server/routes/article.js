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
const express_1 = __importDefault(require("express"));
const controllers = __importStar(require("../controllers/article"));
const passport_1 = __importDefault(require("passport"));
const article = express_1.default.Router();
article.route("/create").post(passport_1.default.authenticate("bearer", { session: false }), controllers.create);
article.route("/edit").post(passport_1.default.authenticate("bearer", { session: false }), controllers.update);
article.route("/").get(controllers.read);
article.route("/remove/:id").get(controllers.remove);
exports.default = article;
//# sourceMappingURL=article.js.map