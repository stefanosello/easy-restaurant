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
var setup = require('dotenv').config();
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var http_1 = __importDefault(require("http"));
var routes_1 = __importDefault(require("./routes"));
var user = __importStar(require("./models/user"));
if (setup.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key");
    process.exit(-1);
}
if (!process.env.JWT_SECRET) {
    console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found");
    process.exit(-1);
}
var app = express_1.default();
var errorHandler = function (err, req, res, next) {
    console.log("Request error: " + JSON.stringify(err));
    res.status(err.statusCode || 500).json(err);
};
// Setup server routes
app
    // Middlewares
    .use(cors_1.default())
    .use(body_parser_1.default.urlencoded({ extended: true }))
    .use(body_parser_1.default.json())
    // Mount routes
    .use(routes_1.default)
    // Error handling
    .use(errorHandler)
    .use(function (req, res, next) {
    res.status(404).json({ statusCode: 404, error: true, errormessage: "Invalid endpoint" });
});
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(function () {
    console.log("Connected to MongoDB");
    var u = user.newUser({
        username: "admin",
    });
    u.setPassword("admin");
    u.setCashDesk();
    u.save()
        .then(function () { return console.log("Admin user created"); })
        .catch(function (err) {
        console.log("Unable to create admin user: " + err);
    });
    // HTTP Server
    http_1.default.createServer(app).listen(process.env.HTTP_PORT, function () {
        console.log("Connected on http://localhost:" + process.env.HTTP_PORT);
    });
    // HTTPS Server
    /*
    https.createServer({
        key: fs.readFileSync('keys/key.pem'),
        cert: fs.readFileSync('keys/cert.pem')
    }, app).listen(process.env.HTTPS_PORT, () => {
        console.log(`Connected on http://localhost:${process.env.HTTPS_PORT}`)
    });
    */
}, function () {
    console.log("Unable to connect to MongoDB");
    process.exit(-2);
});
