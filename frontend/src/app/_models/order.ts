export class Item {
	item: string | any;
	quantity: number;
	cook: string;
	start: Date;
	end: Date
}

export class Order {
	readonly _id: string;
	readonly created_at: Date;
	processed: Date;
	type: string;
	items: Item[];
};