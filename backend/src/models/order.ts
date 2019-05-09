import mongoose, { Document, Schema, model } from "mongoose";
 
export interface IOrder extends Document {
	readonly _id: Schema.Types.ObjectId;
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
	kitchen: [{
	    food_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Item" },
	    quantity: { type: Number, required: true }
	}],
	bar: [{
	    beverage_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Item" },
	    quantity: { type: Number, required: true }
	}]
});

const Order = model<IOrder>('Order', OrderSchema);
export default Order; 