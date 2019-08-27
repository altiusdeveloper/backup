"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const STORAGE_ROOT_DIR = "storage";
const STORAGE_ROOT_PATH = `${path_1.default.dirname(require.main.filename)}/../../client/public/${STORAGE_ROOT_DIR}`;
if (!fs_1.default.existsSync(STORAGE_ROOT_PATH)) {
    fs_1.default.mkdirSync(STORAGE_ROOT_PATH);
}
exports.uploadBlob = (stream, contentLength, containerName, blobName) => {
    const blobURL = `/${STORAGE_ROOT_DIR}/${containerName}/${blobName}`;
    const targetDir = `${STORAGE_ROOT_PATH}/${containerName}`;
    const targetPath = `${targetDir}/${blobName}`;
    return new Promise((resolve, reject) => {
        if (!fs_1.default.existsSync(targetDir)) {
            fs_1.default.mkdirSync(targetDir);
        }
        const fd = fs_1.default.openSync(targetPath, "w");
        const writable = fs_1.default.createWriteStream(targetPath);
        stream.pipe(writable);
        fs_1.default.closeSync(fd);
        resolve({
            blobUrl: blobURL,
            statusCode: 200
        });
    });
};
exports.generateSigningUrlParams = () => {
    return "";
};
//# sourceMappingURL=blob-storage.js.map