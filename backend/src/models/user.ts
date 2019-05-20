import { Document, Schema, Model, model } from 'mongoose';
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export enum Roles {
    Cook = "cook",
    Waiter = "waiter",
    CashDesk = "cash_desk",
    Bartender = "bartender"
}

interface IUser extends Document {
    readonly _id: Schema.Types.ObjectId,
    username: string,
    password: string,
    name: {
        first: string,
        last: string
    }
    role: string,
    sessions: [{
        ip: string,
        token: string
    }]
    validatePassword: (pwd: string) => boolean,
    generateToken: (exp?: string) => string,
    generateRefreshToken: (ip: string) => string
}

// declare user static members and methods here
interface IUserModel extends Model<IUser> {
    roles: Readonly<object>
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    name: {
        first: String,
        last: String
    },
    sessions: [{
        ip: String,
        token: String
    }],
    role: { type: String, enum: Object.values(Roles), required: true }
})

UserSchema.pre<IUser>('save', function (next) {
    // hash password
    let saltRounds = 12;
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

UserSchema.methods.validatePassword = function (pwd: string): boolean {
    return bcrypt.compareSync(pwd, this.password);
}

UserSchema.methods.generateToken = function (exp: string = '1h'): string {
    return jsonwebtoken.sign({
        username: this.username,
        role: this.role,
        id: this._id
    }, process.env.JWT_SECRET!, { expiresIn: exp })
}

UserSchema.methods.generateRefreshToken = function (ip: string): string {
    let token = ip;
    
    /*
    if (this.sessions.some(e => e.ip == ip)){
        // TODO: take refresh token from db
        token = ip
    }
    else {
        // TODO: generate new token and push to db
        this.sessions.push({ ip, token })
        this.save();
    }
    */

    if (!token)
        throw ("Error generating random token")

    return jsonwebtoken.sign({
        username: this.username,
        role: this.role,
        id: this._id,
        token: token
    }, process.env.JWT_SECRET!)

}

UserSchema.statics.roles = Object.values(Roles);

const User = model<IUser, IUserModel>('User', UserSchema)
export default User