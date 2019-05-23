export class Order {
	readonly _id: string;
	readonly created_at: Date;
	processed: Date;
	type: string;
    items: {
        item: string,
		quantity: number,
		cook: string,
		start: Date,
		end: Date
	}[];
};