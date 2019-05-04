import { Document, Schema, Model, model } from 'mongoose';
import jsonwebtoken from 'jsonwebtoken'
import crypto from 'crypto';

export enum Roles {
    Cook = "cook",
    Waiter = "waiter",
    CashDesk = "cash_desk"
}

interface IUser extends Document {
    readonly _id: Schema.Types.ObjectId,
    username: string,
    name: {
        first: string,
        last: string
    }
    role: string,
    salt: string,
    digest: string,
    setPassword: (pwd: string) => void,
    validatePassword: (pwd: string) => boolean,
    generateToken: (exp?: string) => string
}

// declare user static members and methods here
interface IUserModel extends Model<IUser> {
    roles: Readonly<object>
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    name: {
        first: String,
        last: String
    },
    role: { type: String, enum: Object.values(Roles), required: true },
    salt: String,
    digest: String
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

UserSchema.methods.generateToken = function (exp: string = '1h'): string {
    return jsonwebtoken.sign({
        username: this.username,
        role: this.role,
        id: this._id
    }, process.env.JWT_SECRET!, { expiresIn: exp })
}

UserSchema.statics.roles = Object.values(Roles);

const User = model<IUser, IUserModel>('User', UserSchema)
export default User