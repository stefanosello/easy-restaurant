import { Document, Schema, model } from "mongoose";
import Order, { IOrder, OrderSchema } from "./order";

export interface IService extends Document {
    readonly _id: Schema.Types.ObjectId,
    covers: number,
    orders: [IOrder],
    timestamp: Date,
    done: boolean
}

export const ServiceSchema: Schema = new Schema({
    covers: { type: Number, required: true },
    orders: [OrderSchema],
    timestamp: { type: Date },
    done: { type: Boolean, default: false }
});

const Service = model<IService>('Service', ServiceSchema);
export default Service; 