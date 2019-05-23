import { Order } from './order'

export class Service {
	covers: number;
	waiter: string;
	orders: Order[];
	timestamp: Date;
	done: boolean;
};

export class Table {
	readonly _id: string
	number: number;
	seats: number;
	busy: boolean;
	services: Service[];

	public toString(): string {
		let response: string = '';
		Object.keys(this).forEach(key => {
			response += `${key}: ${this[key]}\n`
		})
		return response;
	}
}
