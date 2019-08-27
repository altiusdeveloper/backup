"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_blob_1 = require("@azure/storage-blob");
const secrets_1 = require("../../util/secrets");
// Use SharedKeyCredential with storage account and account key
const sharedKeyCredential = new storage_blob_1.SharedKeyCredential(secrets_1.STORAGE_ACCOUNT, secrets_1.STORAGE_ACCOUNT_KEY);
// Use TokenCredential with OAuth token
const tokenCredential = new storage_blob_1.TokenCredential("token");
tokenCredential.token = "renewedToken"; // Renew the token by updating token field of token credential
// Use sharedKeyCredential, tokenCredential or anonymousCredential to create a pipeline
const pipeline = storage_blob_1.StorageURL.newPipeline(sharedKeyCredential);
// List containers
const serviceURL = new storage_blob_1.ServiceURL(
// When using AnonymousCredential, following url should include a valid SAS or support public access
`https://${secrets_1.STORAGE_ACCOUNT}.blob.core.windows.net`, pipeline);
exports.uploadBlob = (stream, contentLength, containerName, blobName) => __awaiter(this, void 0, void 0, function* () {
    // Create container if it is not existing
    let existing = false;
    const containerURL = storage_blob_1.ContainerURL.fromServiceURL(serviceURL, containerName);
    const listContainersResponse = yield serviceURL.listContainersSegment(storage_blob_1.Aborter.none, undefined, { prefix: containerName });
    for (const container of listContainersResponse.containerItems) {
        if (containerName === container.name) {
            existing = true;
            break;
        }
    }
    if (!existing) {
        yield containerURL.create(storage_blob_1.Aborter.none);
    }
    // Upload blob to specified container
    const blobURL = storage_blob_1.BlobURL.fromContainerURL(containerURL, blobName);
    const blockBlobURL = storage_blob_1.BlockBlobURL.fromBlobURL(blobURL);
    return blockBlobURL
        .upload(storage_blob_1.Aborter.none, () => stream, contentLength)
        .then((value) => {
        return new Promise((resolve, reject) => {
            resolve({
                blobUrl: blockBlobURL.url,
                statusCode: value._response.status
            });
        });
    });
});
exports.generateSigningUrlParams = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server
    const expireTime = new Date();
    expireTime.setDate(expireTime.getDate() + 1);
    return storage_blob_1.generateAccountSASQueryParameters({
        expiryTime: expireTime,
        permissions: storage_blob_1.AccountSASPermissions.parse("r").toString(),
        protocol: storage_blob_1.SASProtocol.HTTPSandHTTP,
        resourceTypes: storage_blob_1.AccountSASResourceTypes.parse("sco").toString(),
        services: storage_blob_1.AccountSASServices.parse("b").toString(),
        startTime: now,
    }, sharedKeyCredential).toString();
};
//# sourceMappingURL=blob-storage.js.map