import { Document, Schema, model } from "mongoose";
import Order, { IOrder } from "./order";

export interface ITable extends Document {
	readonly _id: Schema.Types.ObjectId;
	number: number;
    pendingOrders: [IOrder];
    pastOrders: [IOrder];
    emptyPendingOrdersList: () => void;
}

const TableSchema: Schema = new Schema({
	number: { type: Number, required: true },
	pendingOrders: [ ],
	pastOrders: [ ]
});

TableSchema.methods.emptyPendingOrdersList = function() {
	this.pastOrders = this.pastOrders.concat(this.pendingOrders);
	this.pendingOrders = [];
} 

const Table = model<ITable>('Table', TableSchema);
export default Table; 