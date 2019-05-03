import { Document, Schema, model} from "mongoose";

export interface ITable extends Document {
    n_seats: number;
    ordinations: [];
}