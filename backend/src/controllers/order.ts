import { Handler } from 'express'
import { Schema } from 'mongoose'
import  Order, { IOrder } from '../models/order'
import  Table from '../models/table'
import User, { Roles } from '../models/user'

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
// TODO: this controller should be accessible only from waiters
export const create: Handler = (req, res, next) => {
	let tableNumber:number = req.params.tableNumber;
	let covers:number = req.body.coversNumber;
	let order:IOrder = new Order({ 
		items: JSON.parse(req.body.order).items,
		type: JSON.parse(req.body.order).type
	});
	
	User.findOne({ username: req.user.username}).then(user => {
		if (user) {
			Table.findOne({ number: tableNumber }, 'services' )
			.then(table => {
				if (table) {
					if (!table.services[0] || table.services[table.services.length-1].done) {
						let service = {
							covers: covers | order.items.length,
							waiter: user._id,
							orders: [order]
						}
						table.services.push(service);
						table.busy = true;
					} else {
						table.services[table.services.length-1].orders.push(order)
					}
					table.save().then(doc => {
						return res.status(200).json(doc);
					})
					.catch(err => {
						console.error(err)
						let msg = `DB error: ${err._message}`;
						return next({ statusCode: 500, error: true, errormessage: msg });
					});
				} else {
					return next({statusCode: 404, error: true, errormessage: "Table not found"});
				}
			})
			.catch(err => {
				let msg:String;
				if (err._message)
					msg = `DB error: ${err._message}`;
				else
					msg = err;
				return next({ statusCode: 500, error: true, errormessage: msg });
			});
		}
	})
}

// This controller should be used to update the items of an order or to mark an order as processed
export const update: Handler = (req, res, next) => {
	let tableNumber:number = req.params.tableNumber;
	let orderId:Schema.Types.ObjectId = req.params.orderId;
	let updatedInfo = JSON.parse(req.body.updatedInfo);
	let updateBlock:any = { };
	
	// changes to order contents can be made only from Cash Desk and Waiters
	if (req.user.role == Roles.Waiter || req.user.role == Roles.CashDesk) {
		if ("items" in updatedInfo) {
			updateBlock['services.orders.$.items'] = updatedInfo.items;
		}
	}
	// changing processed status of an order can only been made from Cash Desk or Cooks
	if ("processed" in updatedInfo && (req.user.role == Roles.CashDesk || req.user.role == Roles.Cook)) {
		if (updatedInfo.processed) {
			updateBlock['services.orders.$.items'] = Date.now();
		} else {
			updateBlock['services.orders.$.items'] = null;
		}
	}

	// update table
	Table.updateOne(
		{ number: tableNumber, 'services.orders._id': orderId },
		{ $set: updateBlock }
	)
	.then(table => {
		return res.status(200).json({ table });
	})
	.catch(err => {
		let msg = `DB error: ${err}`;
		return next({ statusCode: 500, error: true, errormessage: msg });
	})
}

export const remove: Handler = (req, res, next) => {
	res.status(501).end();
}
