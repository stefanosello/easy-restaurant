import { Document, Schema, model} from "mongoose";

const Roles = Object.freeze({
	Cook: "cook",
	Waiter: "waiter",
	CashDesk: "cash_desk"
});

export interface IUser extends Document {
	username: string;
	digest: string;
	salt: string;
	role: string;
}

const UserSchema: Schema = new Schema({
	username: { type: String, required: true, unique: true },
	digest: { type: String, required: true },
	salt: { type: String, required: true },
	role: { type: String, enum: Object.values(Roles) }
});

Object.assign(UserSchema.statics, { Roles });

export default model<IUser>('User', UserSchema);