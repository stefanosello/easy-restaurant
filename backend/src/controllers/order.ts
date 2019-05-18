import { Handler } from 'express'
import { Schema } from 'mongoose'
import  Order, { IOrder } from '../models/order'
import  Table from '../models/table'
import { Roles } from '../models/user'

// After analyzed the context in which this kind of controller could be used
// it was decided to allow searching an order by Id only in the pending orders list of a table
export const get: Handler = (req, res, next) => {
	let findBlock:any = { };
	if ('tableNumber' in req.params) {
		findBlock['number'] = req.params.tableNumber;
	}
	if ('orderId' in req.params) {
		findBlock['pendingOrders._id'] = req.params.orderId;
	}
	Table.findOne(findBlock)
		.populate('pendingOrders.kitchen.food')
		.populate('pendingOrders.bar.beverage')
		.then(result => {
			if (result) {
				let response:any = { };
				if ('pendingOrders._id' in findBlock) {
					response = result.pendingOrders.find((element) => element._id == findBlock['pendingOrders._id']);
				} else {
					response = {
						'pendingOrders': result.pendingOrders,
						'pastOrders': result.pastOrders
					}
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
		"kitchen": [
			{ "food_id": <itemId>, "quantity": <number> },
			etc...
		],
		"bar": [
			{ "beverage_id": <itemId>, "quantity": <number> },
			etc...
		]
	} 

*/
export const create: Handler = (req, res, next) => {
	let tableNumber:number = req.params.tableNumber;
	let order:IOrder = new Order({ 
		kitchen: JSON.parse(req.body.order).kitchen, 
		bar: JSON.parse(req.body.order).bar
	});
	Table.findOneAndUpdate(
		{ number: tableNumber }, 
		{ $push: { pendingOrders: order } }
	)
		.then(table => res.status(200).end())
		.catch(err => {
			let msg = `DB error: ${err.errmsg}`
			return next({ statusCode: 500, error: true, errormessage: msg });
		});
}

export const update: Handler = (req, res, next) => {
	let tableNumber:number = req.params.tableNumber;
	let orderId:Schema.Types.ObjectId = req.params.orderId;
	let updatedInfo = JSON.parse(req.body.updatedInfo);
	let updateBlock:any = { };
	// changes to order contents can be made only from Cash Desk and Waiters
	if (req.user.role == Roles.Waiter || req.user.role == Roles.CashDesk) {
		if ("kitchen" in updatedInfo) {
			updateBlock['pendingOrders.$.kitchen'] = updatedInfo.kitchen;
		}
		if ("bar" in updatedInfo) {
			updateBlock['pendingOrders.$.bar'] = updatedInfo.bar;
		}
	}
	// changing processed status of an order can only been made from Cash Desk or Cooks
	if ("processed" in updatedInfo && (req.user.role == Roles.CashDesk || req.user.role == Roles.Cook)) {
		if (updatedInfo.processed) {
			updateBlock['pendingOrders.$.processed'] = Date.now();
		} else {
			updateBlock['pendingOrders.$.processed'] = null;
		}
	}
	Table.updateOne(
		{ number: tableNumber, 'pendingOrders._id': orderId },
		{ $set: updateBlock },
		(err) => {
			if (err) {
				let msg = `DB error: ${err}`;
				return next({ statusCode: 500, error: true, errormessage: msg });
			}
		}
	)
	.then(table => {
		return res.status(200).json({ table });
	});
}

export const emptyPendingOrdersList: Handler = (req, res, next) => {
	Table.findOne({ number: req.params.tableNumber })
		.then(table => {
			if (table) {
				let pendingOrders:IOrder[] = table.pendingOrders;
				table.update({
					$push: { pastOrders: { $each: pendingOrders } },
					$pullAll: { pendingOrders: pendingOrders } 
				})
				.exec()
				.then(table => {
					return res.status(200).json({ table });
				})
				.catch(err => {
					let msg = `DB error: ${err}`;
					return next({ statusCode: 500, error: true, errormessage: msg });
				});
			} else {
				return next({ statusCode: 404, error: true, errormessage: "Table not found" });
			}
		})
		.catch(err => {
			let msg = `DB error: ${err}`;
			return next({ statusCode: 500, error: true, errormessage: msg });
		});
}

export const remove: Handler = (req, res, next) => {
	res.status(501).end();
}
