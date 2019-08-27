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
const storage_1 = __importDefault(require("../repository/storage"));
const random = __importStar(require("../util/random"));
exports.create = (req, res, next) => {
    const containerName = "avatar";
    const blobName = `${req.user._id}_${random.getUid(8)}.png`;
    storage_1.default.uploadBlob(req, parseInt(req.headers["content-length"]), containerName, blobName).then((value) => {
        if (value.statusCode >= 200 && value.statusCode < 300) {
            const sasToken = storage_1.default.generateSigningUrlParams();
            res.status(value.statusCode).json({ url: `${value.blobUrl}?${sasToken}` });
        }
        else {
            res.status(value.statusCode).end();
        }
    }).catch((reason) => {
        console.error(JSON.stringify(reason));
        res.status(500).json(reason);
    });
};
//# sourceMappingURL=avatar.js.map