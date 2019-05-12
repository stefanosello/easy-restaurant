import { Handler } from 'express'
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

export const get: Handler = (req, res, next) => {
	Order.findOne(req.params.orderId)
		.then(order => {
			return res.status(200).json({ order });
		})
		.catch(err => {
			return next({ statusCode: 404, error: true, errormessage: `DB error: ${err}`})
		})
}

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
	res.status(501);
}

export const updatePartial: Handler = (req, res, next) => { 
	res.status(501);
}

export const remove: Handler = (req, res, next) => {
	res.status(501);
}