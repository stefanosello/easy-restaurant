import { Document, Schema, model } from "mongoose";

export interface IOrder extends Document {
    kitchen: [{
        food: string,
        quantity: number
    }];
    bar: [{
        beverage: string,
        quantity: number
    }];
}

const OrderSchema: Schema = new Schema({

})