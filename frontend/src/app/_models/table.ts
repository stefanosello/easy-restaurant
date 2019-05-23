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
}
