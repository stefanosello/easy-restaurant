export enum Types {
    Beverage = "beverage",
    Food = "food"
}
 
export class Item {
	readonly _id: string;
	readonly name: string;
	price: number;
	type: string;
	subtype: string;
};