import { Handler } from 'express'
import { Schema } from 'mongoose'
import  Order, { IOrder } from '../models/order'
import  Table from '../models/table'
import User, { Roles } from '../models/user'
import orders from '../routes/orders';

// After analyzed the context in which this kind of controller could be used
// it was decided to allow searching an order by Id only in the pending orders list of a table
export const get: Handler = (req, res, next) => {
	let findBlock:any = { };

	// table number, always present
	if ('tableNumber' in req.params) {
		findBlock['number'] = req.params.tableNumber;
	}
	// order id
	if ('orderId' in req.params) {
		findBlock['services.orders._id'] = req.params.orderId;
	}
	// order type (food | beverage), from query string
	if ('orderType' in req.query) {
		findBlock['services.orders.type'] = req.query.orderType;
	}
	// is the service already done? from query string
	if ('serviceDone' in req.query) {
		findBlock['services.done'] = req.query.serviceDone;
	}

	Table.findOne(findBlock)
    .populate('services.orders.items.item')
		.then(result => {
			if (result) {
				let response:any = { } 
				let orders:IOrder[] = [];
				result.services.forEach(service => {
					service.orders.forEach((order: IOrder) => {
						orders.push(order);
					})
				})
				if ('services.orders._id' in findBlock) {
					response = orders.find(element => {
						return element._id === findBlock['services.orders._id'];
					})
				} else {
					response = orders;
				}
				return res.status(200).json(response);
			} else {
				return next({statusCode: 500, error: true, errormessage: "Table not found"});
			}
		})
		.catch(err => {
			return next({statusCode: 500, error: true, errormessage: err});
		})
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
// TODO: this controller should be accessible aonly from waiters
export const create: Handler = (req, res, next) => {
	let tableNumber:number = req.params.tableNumber;
	let covers:number = req.params.coversNumber;
	let order:IOrder = new Order({ 
		items: JSON.parse(req.body.order).items,
		type: JSON.parse(req.body.order).type
	});
	User.findOne({ username: req.user.username}).then(user => {
		if (user) {
			Table.findOne({ number: tableNumber }, 'services' )
			.then(table => {
				if (table) {
					if (table.services[table.services.length - 1].done) {
						let service = {
							covers: covers | order.items.length,
							waiter: user._id,
							orders: [order]
						}
						table.services.push(service);
					} else {
						table.services[table.services.length - 1].orders.push(order)
					}
					table.save().then(doc => {
						return res.status(200).json(doc);
					});
				} else {
					return next({statusCode: 500, error: true, errormessage: "Table not found"});
				}
			})
			.catch(err => {
				let msg = `DB error: ${err.errmsg}`
				return next({ statusCode: 500, error: true, errormessage: msg });
			});
		}
	})
}

// export const update: Handler = (req, res, next) => {
// 	let tableNumber:number = req.params.tableNumber;
// 	let orderId:Schema.Types.ObjectId = req.params.orderId;
// 	let updatedInfo = JSON.parse(req.body.updatedInfo);
// 	let updateBlock:any = { };
// 	// changes to order contents can be made only from Cash Desk and Waiters
// 	if (req.user.role == Roles.Waiter || req.user.role == Roles.CashDesk) {
// 		if ("kitchen" in updatedInfo) {
// 			updateBlock['pendingOrders.$.kitchen'] = updatedInfo.kitchen;
// 		}
// 		if ("bar" in updatedInfo) {
// 			updateBlock['pendingOrders.$.bar'] = updatedInfo.bar;
// 		}
// 	}
// 	// changing processed status of an order can only been made from Cash Desk or Cooks
// 	if ("processed" in updatedInfo && (req.user.role == Roles.CashDesk || req.user.role == Roles.Cook)) {
// 		if (updatedInfo.processed) {
// 			updateBlock['pendingOrders.$.processed'] = Date.now();
// 		} else {
// 			updateBlock['pendingOrders.$.processed'] = null;
// 		}
// 	}
// 	Table.updateOne(
// 		{ number: tableNumber, 'pendingOrders._id': orderId },
// 		{ $set: updateBlock },
// 		(err) => {
// 			if (err) {
// 				let msg = `DB error: ${err}`;
// 				return next({ statusCode: 500, error: true, errormessage: msg });
// 			}
// 		}
// 	)
// 	.then(table => {
// 		return res.status(200).json({ table });
// 	});
// }

// export const remove: Handler = (req, res, next) => {
// 	res.status(501).end();
// }
