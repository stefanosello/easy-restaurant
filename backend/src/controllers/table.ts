import { Handler } from 'express'
import  Table from '../models/table'

export const getAll: Handler = (req, res, next) => {
	console.log(req.query);
  	Table.find(req.query)
	    .then(tables => {
	      return res.status(200).json({ tables, links: [{ href: req.baseUrl, rel: "self" }] })
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
			return next({ statusCode: 404, error: true, errormessage: `DB error: ${err}`})
		})
}

export const update: Handler = (req, res, next) => { }
export const updatePartial: Handler = (req, res, next) => { }
export const remove: Handler = (req, res, next) => { }