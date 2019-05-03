"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var crypto_1 = __importDefault(require("crypto"));
var Roles = Object.freeze({
    Cook: "cook",
    Waiter: "waiter",
    CashDesk: "cash_desk"
});
var UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(Roles), required: true },
    salt: { type: String, required: true },
    digest: { type: String, required: true }
});
// Here we add some methods to the user Schema
UserSchema.methods.setPassword = function (pwd) {
    this.salt = crypto_1.default.randomBytes(16).toString('hex'); // We use a random 16-bytes hex string for salt
    // We use the hash function sha512 to hash both the password and salt to
    // obtain a password digest 
    // 
    // From wikipedia: (https://en.wikipedia.org/wiki/HMAC)
    // In cryptography, an HMAC (sometimes disabbreviated as either keyed-hash message 
    // authentication code or hash-based message authentication code) is a specific type 
    // of message authentication code (MAC) involving a cryptographic hash function and 
    // a secret cryptographic key.
    //
    var hmac = crypto_1.default.createHmac('sha512', this.salt);
    hmac.update(pwd);
    this.digest = hmac.digest('hex'); // The final digest depends both by the password and the salt
};
UserSchema.methods.validatePassword = function (pwd) {
    // To validate the password, we compute the digest with the
    // same HMAC to check if it matches with the digest we stored
    // in the database.
    //
    var hmac = crypto_1.default.createHmac('sha512', this.salt);
    hmac.update(pwd);
    var digest = hmac.digest('hex');
    return (this.digest === digest);
};
UserSchema.methods.setCook = function () {
    this.role = Roles.Cook;
};
UserSchema.methods.setWaiter = function () {
    this.role = Roles.Waiter;
};
UserSchema.methods.setCashDesk = function () {
    this.role = Roles.CashDesk;
};
Object.assign(UserSchema.statics, { Roles: Roles });
function getSchema() { return UserSchema; }
exports.getSchema = getSchema;
var userModel; // This is not exposed outside the model
function getModel() {
    if (!userModel) {
        userModel = mongoose_1.model('User', getSchema());
    }
    return userModel;
}
exports.getModel = getModel;
function newUser(data) {
    var _usermodel = getModel();
    return new _usermodel(data);
}
exports.newUser = newUser;
