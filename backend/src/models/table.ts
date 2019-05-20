import { Document, Schema, model } from "mongoose";
import { IService, ServiceSchema } from "./service";

export interface ITable extends Document {
	readonly _id: Schema.Types.ObjectId;
	number: number;
	seats: number,
	waiter: Schema.Types.ObjectId,
	busy: boolean;
	services: [IService];
}

const TableSchema: Schema = new Schema({
	number: { type: Number, required: true, unique: true },
	seats: { type: Number, required: true },
	waiter: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	busy: { type: Boolean, default: false },
	services: [ServiceSchema]
});

const Table = model<ITable>('Table', TableSchema);
export default Table; 