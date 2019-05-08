import { Document, Schema, Model, model } from 'mongoose';
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt';

export enum Roles {
    Cook = "cook",
    Waiter = "waiter",
    CashDesk = "cash_desk"
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
    validatePassword: (pwd: string) => boolean,
    generateToken: (exp?: string) => string
}

// declare user static members and methods here
interface IUserModel extends Model<IUser> {
    roles: Readonly<object>
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: String,
    name: {
        first: String,
        last: String
    },
    role: { type: String, enum: Object.values(Roles), required: true }
})

UserSchema.pre<IUser>('save', function (next) {
    // hash password
    let saltRounds = 12;
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

UserSchema.methods.validatePassword = function (pwd: string): boolean {
    return bcrypt.compareSync(pwd, this.password)
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