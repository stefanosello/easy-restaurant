import { Document, Schema, model } from "mongoose";

export interface ITable extends Document {
    seats: number;
    ordinations: [];
}