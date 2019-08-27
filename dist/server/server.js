"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
/**
 * Start Express server.
 */
const server = app_1.default.listen(app_1.default.get("server_port"), () => {
    console.log("  App is running at %s:%d in %s mode", app_1.default.get("origin_uri"), app_1.default.get("server_port"), app_1.default.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
exports.default = server;
//# sourceMappingURL=server.js.map