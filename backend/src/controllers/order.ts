import { Handler } from 'express'
import { Schema } from 'mongoose'
import Order, { IOrder } from '../models/order'
import Table, { ITable } from '../models/table'
import User, { Roles } from '../models/user'

/**
 * This controller does a lot of things. It can return a single object (if 'orderId' is specified in route params) or an array of object otherwise.
 * This controller allows to specify via querystring some params to filter the results:
 * **route params**
 * - orderId: the id of the desidered order, makes the controller to return a single order
 * - tableNumber: specifies the number in wich orders should be searched (excludes other table's orders)
 * **query params**
 * - serviceDone: [Boolean] allows to search orders only in those services with the specified status (done or not done)
 * - type: [String] searchs for orders of a certain type (food or beverage)
 * - processed: [Boolean] searchs for orders processed or not already processed (as specified by the param) 
 */
export const get: Handler = (req, res, next) => {
	let findBlock: any = {}
	let queryParams: any = req.query;
	if ('tableNumber' in req.params)
		findBlock['number'] = req.params.tableNumber;

	let query = Table.find(findBlock)

	if ('populate' in queryParams && queryParams.populate == 'true')
		query.populate('services.orders.items.item')

	query
		.then((tables: ITable[]) => {
			let response: any;
			let orders: IOrder[] = [];
			tables.forEach((table: ITable) => {
				table.services.forEach((service: any) => {
					if (!('serviceDone' in queryParams) || ('serviceDone' in queryParams && service.done == queryParams.serviceDone)) {
						orders = orders.concat(service.orders.filter((order: IOrder) => {
							let processed = queryParams.processed != 'false';
							return (
								!('type' in queryParams && order.type != queryParams.type)
								&& !('processed' in queryParams && processed != Boolean(order.processed))
							)
						}));
					}
				})
			});
			if ('orderId' in queryParams) {
				response = orders.find((order: IOrder) => { return order._id == queryParams.orderId });
			} else {
				response = orders;
			}
			res.status(200).json({ orders: response });
		})
		.catch(err => next({ statusCode: 500, error: true, errormessage: err }))
}

/* This method should handle a request with req.body containing an object like:

	"order": {
		"items": [
			{ "item": <itemId>, "quantity": <number> },
			etc...
		],
		"type": "food" | "beverage"
	} 

*/
// TODO: this controller should be accessible only from waiters
export const create: Handler = (req, res, next) => {
	let tableNumber: number = req.params.tableNumber;
	let covers: number = req.body.coversNumber;
	let order: IOrder = new Order({
		items: JSON.parse(req.body.order).items,
		type: JSON.parse(req.body.order).type
	});

	Table.findOne({ number: tableNumber }, 'services')
		.then(table => {
			if (!table)
				return next({ statusCode: 404, error: true, errormessage: "Table not found" });

			if (!table.services[0] || table.services[table.services.length - 1].done) {
				let service = {
					covers: covers | order.items.length,
					waiter: req.user.id,
					orders: [order]
				}
				table.services.push(service);
				table.busy = true;
			} else {
				table.services[table.services.length - 1].orders.push(order)
			}
			table.save()
				.then(doc => res.status(200).json(doc))
				.catch(err => {
					// console.error(err)
					let msg = `DB error: ${err._message}`;
					next({ statusCode: 500, error: true, errormessage: msg });
				});
		})
		.catch(err => {
			let msg: String;
			if (err._message)
				msg = `DB error: ${err._message}`;
			else
				msg = err;
			next({ statusCode: 500, error: true, errormessage: msg });
		});
}

// This controller should be used to update the items of an order or to mark an order as processed
// !!! can be used only with services not already done (what's the sense of using it with a service already done?)
export const update: Handler = (req, res, next) => {
	let tableNumber: number = req.params.tableNumber;
	let orderId: Schema.Types.ObjectId = req.params.orderId;
	let updatedInfo: any = req.body.updatedInfo ? JSON.parse(req.body.updatedInfo) : {};
	let updateBlock: any = {};

	// changes to order contents can be made only from Cash Desk and Waiters
	if (req.user.role == Roles.Waiter || req.user.role == Roles.CashDesk) {
		if (updatedInfo && "items" in updatedInfo) {
			updateBlock['items'] = updatedInfo.items;
		}
	}
	// changing processed status of an order can only been made from Cash Desk or Cooks
	if ("processed" in req.body && (req.user.role == Roles.CashDesk || req.user.role == Roles.Cook)) {
		if (req.body.processed) {
			updateBlock['processed'] = Date.now();
		} else {
			updateBlock['processed'] = null;
		}
	}

	// update table
	Table.findOne({
		number: tableNumber,
		'services.0.orders._id': orderId,
		'services.0.done': false
	})
		.then(table => {
			if (!table)
				return next({ statusCode: 400, error: true, errormessage: "Wrong params" });

			// first service is the one we need to update
			let orderIndex = table.services[table.services.length - 1].orders.findIndex((order: IOrder) => {
				return order._id == orderId;
			})
			// real update for all keys contained in updateBlock
			Object.keys(updateBlock).forEach((key: string) => {
				table.services[table.services.length - 1].orders[orderIndex][key] = updateBlock[key];
			});
			table.save((err, table) => {
				if (err) {
					return next({ statusCode: 500, error: true, errormessage: err });
				}
				res.status(200).json({ table });
			});
		})
		.catch(err => {
			let msg = `DB error: ${err}`;
			next({ statusCode: 500, error: true, errormessage: msg });
		});
}

export const remove: Handler = (req, res, next) => {
	res.status(501).end();
}
