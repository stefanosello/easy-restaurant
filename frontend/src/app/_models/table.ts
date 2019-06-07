import { Order } from './order'
import { User } from './user';

export class Service {
	covers: number;
	waiter: User;
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
