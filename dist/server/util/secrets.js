"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
exports.ENVIRONMENT = process.env.NODE_ENV;
const prod = exports.ENVIRONMENT === "production";
if (prod) {
    console.log = (input) => { };
    dotenv_1.default.config({ path: ".env.production" });
}
else {
    console.log("  Using .env.development file to supply config environment variables");
    dotenv_1.default.config({ path: ".env.development" }); // you can delete this after you create your own .env file!
}
exports.SESSION_SECRET = process.env.SESSION_SECRET;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.STORAGE_ACCOUNT = process.env.STORAGE_ACCOUNT;
exports.STORAGE_ACCOUNT_KEY = process.env.STORAGE_ACCOUNT_KEY;
if (!exports.SESSION_SECRET) {
    console.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}
if (!exports.MONGODB_URI) {
    console.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
let url;
if (parseInt(process.env["PORT"]) === 80) {
    url = process.env.ORIGIN_URI;
}
else {
    url = `${process.env.ORIGIN_URI}:${process.env.PORT}`;
}
exports.APP_URL = url;
//# sourceMappingURL=secrets.js.map