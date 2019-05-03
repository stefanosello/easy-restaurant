import { Document, Schema, Model, model } from 'mongoose';
import crypto from 'crypto';

const Roles = Object.freeze({
    Cook: "cook",
    Waiter: "waiter",
    CashDesk: "cash_desk"
});

export interface IUser extends Document {
    readonly _id: Schema.Types.ObjectId,
    username: string,
    role: string,
    salt: string,
    digest: string,
    setPassword: (pwd: string) => void,
    validatePassword: (pwd: string) => boolean,
    setCook: () => void,
    setWaiter: () => void,
    setCashDesk: () => void
}

var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(Roles), required: true },
    salt: { type: String, required: true },
    digest: { type: String, required: true }
})

// Here we add some methods to the user Schema

UserSchema.methods.setPassword = function (pwd: string) {

    this.salt = crypto.randomBytes(16).toString('hex'); // We use a random 16-bytes hex string for salt

    // We use the hash function sha512 to hash both the password and salt to
    // obtain a password digest 
    // 
    // From wikipedia: (https://en.wikipedia.org/wiki/HMAC)
    // In cryptography, an HMAC (sometimes disabbreviated as either keyed-hash message 
    // authentication code or hash-based message authentication code) is a specific type 
    // of message authentication code (MAC) involving a cryptographic hash function and 
    // a secret cryptographic key.
    //
    var hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    this.digest = hmac.digest('hex'); // The final digest depends both by the password and the salt
}

UserSchema.methods.validatePassword = function (pwd: string): boolean {

    // To validate the password, we compute the digest with the
    // same HMAC to check if it matches with the digest we stored
    // in the database.
    //
    var hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    var digest = hmac.digest('hex');
    return (this.digest === digest);
}

UserSchema.methods.setCook = function (): void {
    this.role = Roles.Cook
}

UserSchema.methods.setWaiter = function (): void {
    this.role = Roles.Waiter
}

UserSchema.methods.setCashDesk = function (): void {
    this.role = Roles.CashDesk
}

Object.assign(UserSchema.statics, { Roles });

export function getSchema() { return UserSchema; }

let userModel: Model<IUser>;  // This is not exposed outside the model
export function getModel(): Model<IUser> { // Return Model as singleton
    if (!userModel) {
        userModel = model('User', getSchema())
    }
    return userModel;
}

export function newUser(data: any): IUser {
    let _usermodel = getModel();
    return new _usermodel(data);
}