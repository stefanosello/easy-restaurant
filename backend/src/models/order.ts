import mongoose, { Document, Schema, model } from "mongoose";
 
export interface IOrder extends Document {
	readonly _id: Schema.Types.ObjectId;
	readonly created_at: Schema.Types.Date;
	processed: Schema.Types.Date;
	[key:number]: number;
    kitchen: [{
        food_id: Schema.Types.ObjectId,
        quantity: number
    }];
    bar: [{
        beverage_id: Schema.Types.ObjectId,
        quantity: number
    }];
};

export const OrderSchema: Schema = new Schema({
	created_at: { type: Date, default: Date.now() },
	processed: { type: Date, default: null },
	kitchen: [{
	    food_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Item" },
	    quantity: { type: Number, required: true }
	}],
	bar: [{
	    beverage_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Item" },
	    quantity: { type: Number, required: true }
	}],
});

const Order = model<IOrder>('Order', OrderSchema);
export default Order; 