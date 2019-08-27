"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const express_session_1 = __importDefault(require("express-session"));
const lusca_1 = __importDefault(require("lusca"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const express_validator_1 = __importDefault(require("express-validator"));
const bluebird_1 = __importDefault(require("bluebird"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const secrets_1 = require("./util/secrets");
const oauth2_1 = __importDefault(require("./routes/oauth2"));
const auth_1 = __importDefault(require("./routes/auth"));
const article_1 = __importDefault(require("./routes/article"));
// API keys and Passport configuration
require("./config/passport-consumer");
const avatar_1 = __importDefault(require("./routes/avatar"));
// Connect to MongoDB
const MongoStore = connect_mongo_1.default(express_session_1.default);
const mongoUrl = secrets_1.MONGODB_URI;
mongoose_1.default.Promise = bluebird_1.default;
mongoose_1.default.set("useNewUrlParser", true);
mongoose_1.default.set("useFindAndModify", false);
mongoose_1.default.set("useCreateIndex", true);
mongoose_1.default.connect(mongoUrl, { useNewUrlParser: true }).then(() => {
    console.log("  MongoDB is connected successfully.");
}).catch(err => {
    console.error("  MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});
// Express configuration
const app = express_1.default();
app.set("server_port", process.env.SERVER_PORT);
app.set("origin_uri", process.env.ORIGIN_URI);
app.use(compression_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_validator_1.default());
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: secrets_1.SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(lusca_1.default.xframe("SAMEORIGIN"));
app.use(lusca_1.default.xssProtection(true));
app.use(function (req, res, next) {
    console.log(`[${req.method} ${req.originalUrl}] is called, body is ${JSON.stringify(req.body)}`);
    next();
});
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
if (process.env.NODE_ENV === "development") {
    app.use(errorhandler_1.default());
}
// Server rendering configuration
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static("./client/build", { maxAge: 31557600000 }));
    app.use((req, res, next) => {
        if (req.originalUrl.startsWith("/api") ||
            req.originalUrl.startsWith("/auth") ||
            req.originalUrl.startsWith("/oauth2")) {
            next();
        }
        else {
            const options = {
                root: "./client/build/",
                dotfiles: "deny",
                headers: {
                    "x-timestamp": Date.now(),
                    "x-sent": true
                }
            };
            const fileName = "index.html";
            res.sendFile(fileName, options, function (err) {
                if (err) {
                    next(err);
                }
                else {
                    console.log("Sent:", fileName);
                }
            });
        }
    });
}
// Primary app routes.
app.use("/auth", auth_1.default); // Auth client routes
app.use("/oauth2", oauth2_1.default); // OAuth2 server routes
app.use("/api/article", article_1.default); // Article related routes
app.use("/api/avatar", avatar_1.default); // Avatar update related routes
// Add more routes like "/api/***" here
exports.default = app;
//# sourceMappingURL=app.js.map