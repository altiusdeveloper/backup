"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const AzureStorage = __importStar(require("./azure/blob-storage"));
const LocalStorage = __importStar(require("./local/blob-storage"));
let storage;
if (process.env.NODE_ENV === "production") {
    storage = AzureStorage;
}
else {
    storage = LocalStorage;
}
exports.default = storage;
//# sourceMappingURL=storage.js.map