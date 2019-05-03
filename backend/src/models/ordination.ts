import { Document, Schema, model} from "mongoose";

export interface IOrdination extends Document {
    kitchen: [{
        food: string,
        quantity: number
    }];
    bar: [{
        beverage: string,
        quantity: number
    }];
}

const OrdinationSchema: Schema = new Schema({
    
})