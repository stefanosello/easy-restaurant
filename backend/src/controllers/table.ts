import { Handler } from 'express'
import  Table from '../models/table'

export const getAll: Handler = (req, res, next) => {
  	Table.find()
	    .then(tables => {
	      return res.status(200).json({ tables })
	    })
	    .catch(err => {
	      return next({ statusCode: 404, error: true, errormessage: `DB error: ${err}` });
	    })
}

export const get: Handler = (req, res, next) => {
	let tableNumber = req.params.tableNumber;
	Table.findOne({ number: tableNumber})
		.then(table => {
			return res.status(200).json({ table });
		})
		.catch(err => {
			return next({ statusCode: 404, error: true, errormessage: `DB error: ${err}`})
		})
}

export const create: Handler = (req, res, next) => {
	let tableNumber = req.body.number;
	Table.create({ number: tableNumber })
		.then(table => {
			res.status(200).json({ table });
		})
		.catch(err => {
			let msg = `DB error: ${err.errmsg}`
		    if (err.code === 11000)
		    	msg = "Table already exists"
		    return next({ statusCode: 409, error: true, errormessage: msg });
		})
}

export const update: Handler = (req, res, next) => { 
	Table.findOneAndUpdate({ number: req.params.number }, req.body)
		.then(table => res.status(200).json({ table }))
		.catch(err => {
			return next({ statusCode: 400, error: true, errormessage: `DB error: ${err.errmsg}` })
		});
}

export const updatePartial: Handler = (req, res, next) => { 
	res.status(501);
}

export const remove: Handler = (req, res, next) => {
	Table.findOneAndDelete({ number: req.params.tableNumber, pendingOrders: { $size: 0 } })
		.then(data => {
			if (!data) {
			res.status(404).json({ error: true, errormessage: "Error occurred: resource not found or pending orders queue not empty" });
		} else {
				res.status(200).json({ error: false, errormessage: "", result: "Table succesfully deleted" });
			}
		})
		.catch(err => {
				return next({ statusCode: 400, error: true, errormessage: `DB error: ${err.errmsg}` })
		});
}

export const getBill: Handler = (req, res, next) => {
	Table.findOne({ number: req.params.tableNumber })
		.populate('pendingOrders.kitchen.food')
		.populate('pendingOrders.bar.beverage')
		.then(table => {
			if (table) {
				let bill:number = 0;
				table.pendingOrders.forEach(order => {
					order.kitchen.forEach(item => {
						bill += item.quantity*item.food.price;
					});
					order.bar.forEach(item => {
						bill += item.quantity*item.beverage.price;
					})
				});
				return res.status(200).json({ bill });
			} else {
				return next({ statusCode: 404, error: true, errormessage: "Table not found" });
			}
		})
		.catch(err => {
			let msg = `DB error: ${err}`;
			return next({ statusCode: 500, error: true, errormessage: msg });
		});
}