import { Handler } from 'express'
import  Table from '../models/table'
import { IOrder } from '../models/order';
import { IItem } from '../models/item';

export const get: Handler = (req, res, next) => {
	let findBlock:any = { };

	if ('tableNumber' in req.params) {
		findBlock['number'] = req.params.tableNumber;
	}
	if ('free' in req.query) {
		findBlock['busy'] = !req.query.free;
	}
	if ('numberOfSeats' in req.query) {
		findBlock['seats'] = req.query.numberOfSeats;
	}
	Table.find(findBlock)
		.then(tables => {
			if (tables.length > 1 || (tables.length == 1 && findBlock['number'] == undefined)) {
				return res.status(200).json({ tables });
			} else if (tables.length == 1 && 'number' in findBlock) {
				return res.status(200).json({ table: tables[0] });
			} else {
				return next({ statusCode: 404, error: true, errormessage: "Table not found"})
			}	
		})
		.catch(err => {
			return next({ statusCode: 500, error: true, errormessage: `DB error: ${err._message}`});
		});
}

export const create: Handler = (req, res, next) => {
	let newTable:any = {
		number: req.body.tableNumber,
		seats: req.body.numberOfSeats
	}
	Table.create(newTable)
		.then(table => {
			res.status(200).json({ table });
		})
		.catch(err => {
			let msg = `DB error: ${err._message}`
			if (err.code === 11000)
				msg = "Table already exists"
			return next({ statusCode: 409, error: true, errormessage: msg });
		});
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
	Table.findOne({ number: req.params.tableNumber })
		.then(data => {
			if (!data) {
        res.status(404).json({ error: true, errormessage: `Error occurred: Table ${req.params.tableNumber} number not found` });
      } else {
        if (data.services[data.services.length - 1].done) {
          data.remove()
          .then(table => {
            res.status(200).json({ error: false, errormessage: "", result: "Table succesfully deleted" });
          })
        } else {
          res.status(404).json({ error: true, errormessage: `Error occurred: Table ${req.params.tableNumber} has uncompleted services` });
        }       
      }
    })
    .catch(err => {
      return next({ statusCode: 400, error: true, errormessage: `DB error: ${err.errmsg}` })
    });
}

export const getBill: Handler = (req, res, next) => {
	Table.findOne({ number: req.params.tableNumber })
		.populate('services.orders.items.item')
		.then(table => {
			if (table) {
				let bill:number = 0;
				table.services.forEach(service => {
					service.orders.forEach((order:IOrder) => {
            order.items.forEach(item => {
              // @ts-ignore -> the field is present but is populated with the 'populate' option, so at compile time it is not present
              bill += item.quantity*item.item.price;
            });
					});
				});
				return res.status(200).json({ bill });
			} else {
				res.status(404).json({ error: true, errormessage: `Error occurred: Table ${req.params.tableNumber} number not found` });
			}
		})
		.catch(err => {
			let msg = `DB error: ${err}`;
			return next({ statusCode: 500, error: true, errormessage: msg });
		});
}