import { Handler } from 'express'
import { Schema } from 'mongoose'
import  Order, { IOrder } from '../models/order'
import  Table from '../models/table'

export const getAll: Handler = (req, res, next) => {
  	Order.find()
	    .then(orders => {
	      return res.status(200).json({ orders })
	    })
	    .catch(err => {
	      return next({ statusCode: 404, error: true, errormessage: `DB error: ${err}` });
	    })
}

// After analyzed the context in which this kind of controller could be used
// it was decided to allow searching an order by Id only in the pending orders list of a table
export const get: Handler = (req, res, next) => {
	let tableNumber:number = req.params.tableNumber;
	Table.findOne(tableNumber)
		.then(table => {
			if (table) {
				let order:IOrder|undefined = table.pendingOrders.find(order => { return order._id == req.params.orderId });
				if (order) {
					return res.status(200).json({ order });
				} else {
					return res.json({ statusCode: 404, error: true, errormessage: "Order not found" });
				}
			} else {
				return res.json({ statusCode: 404, error: true, errormessage: `Table ${tableNumber} not found`});
			}
		})
		.catch(err => {
			return next({ statusCode: 404, error: true, errormessage: `DB error: ${err}`})
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
	if (updatedInfo.kitchen) {
		updateBlock['pendingOrders.$.kitchen'] = updatedInfo.kitchen;
	}
	if (updatedInfo.bar) {
		updateBlock['pendingOrders.$.bar'] = updatedInfo.bar;
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
				table.emptyPendingOrdersList();
				table.save()
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
	res.status(403).end();
}