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
var express_1 = require("express");
var express_jwt_1 = __importDefault(require("express-jwt"));
var passport_1 = __importDefault(require("passport"));
var passport_http_1 = __importDefault(require("passport-http"));
var login_1 = __importDefault(require("../controllers/login"));
var user = __importStar(require("../models/user"));
var auth = express_jwt_1.default({ secret: process.env.JWT_SECRET });
var router = express_1.Router();
passport_1.default.use(new passport_http_1.default.BasicStrategy(function (username, password, done) {
    user.getModel().findOne({ username: username }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (!user.validatePassword(password)) {
            return done(null, false);
        }
        return done(null, user);
    });
}));
router
    // Root and login pages are public
    .get('/', function (req, res, next) { return res.send('Hello world!'); })
    .get("/login", passport_1.default.authenticate('basic', { session: false }), login_1.default)
    // Every other page requires access
    .use(auth)
    .get('/users', function (req, res, next) { return res.send('User endpoint'); })
    .get('/tables', function (req, res, next) { return res.send('Tables endpoint'); })
    .get('/orders', function (req, res, next) { return res.send('Orders endpoint'); });
exports.default = router;
