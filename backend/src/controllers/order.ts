import { Handler } from 'express';
import { Schema } from 'mongoose';
import Order, { IOrder } from '../models/order';
import Table, { ITable } from '../models/table';
import SocketHelper from '../helpers/socketio';
import { pushNotice } from '../helpers/notice';
import User, { IUser } from '../models/user';

/**
 * Controller used to retrieve orders info.
 * This controller allows to specify via querystring some params to filter the results:
 * **route params**
 * @param orderId: the id of the desidered order, makes the controller to return a single order
 * @param tableNumber: specifies the number in wich orders should be searched (excludes other table's orders)
 * **query params**
 * @param serviceDone: [Boolean] allows to search orders only in those services with the specified status (done or not done) (1 for true, 0 for false)
 * @param type: [String] searchs for orders of a certain type (food or beverage)
 * @param processed: [Boolean] searchs for orders processed or not already processed (as specified by the param)
 * @param populate: [Boolean] populate option (1 for true, 0 for false)
 * **return value**
 * @returns {
 * 	richInfo: array of { order: order info, tableNumber: number of the related table, waiter: waiter info },
 * 	orders: array of IOrder
 * }
 */
export const get: Handler = (req, res, next) => {
	const findBlock: any = {}
	const queryParams: any = req.query;
	if ('tableNumber' in req.params) {
		findBlock.number = req.params.tableNumber;
	}

	const query = Table.find(findBlock);
	if ('populate' in queryParams && queryParams.populate) {
		query
			.populate('services.orders.items.item')
			.populate('services.waiter', ['_id', 'username', 'role'])
	}

	query
		.then((tables: ITable[]) => {
			const response: any = {
				richInfo: []
			};
			let orders: IOrder[] = [];
			tables.forEach((table: ITable) => {
				table.services.forEach((service: any) => {
					let newOrders: IOrder[] = []
					if (!('serviceDone' in queryParams) || ('serviceDone' in queryParams && service.done === queryParams.serviceDone)) {
						newOrders = service.orders.filter((order: IOrder) => {
							const processed = queryParams.processed;
							return (
								!('type' in queryParams && order.type !== queryParams.type)
								&& !('processed' in queryParams && processed !== Boolean(order.processed))
							)
						});
					}
					newOrders.forEach(order => {
						response.richInfo.push({
							order,
							waiter: service.waiter,
							tableNumber: table.number
						});
					});
					orders = orders.concat(newOrders);
				});
			});
			if ('orderId' in queryParams) {
				response.richInfo = response.rinchInfo.find((info: any) => { return info.order._id === queryParams.orderId });
				response.order = orders.find((order: IOrder) => { return order._id === queryParams.orderId });
			} else {
				response.orders = orders;
			}
			res.status(200).json(response);
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
	const tableNumber: number = parseInt(req.params.tableNumber, 10);
	const covers: number = req.body.coversNumber;
	const order: IOrder = new Order({
		items: req.body.order.items,
		type: req.body.order.type
	});

	Table.findOne({ number: tableNumber })
		.then(table => {
			if (!table) {
        return next({ statusCode: 404, error: true, errormessage: "Table not found" });
      }
			if (!table.services[0] || table.services[table.services.length - 1].done) {
				const user: IUser = new User(req.user);
				const service = {
					covers: covers || order.items.length,
					waiter: user.id,
					orders: [order]
				}
				table.services.push(service);
				table.busy = true;
			} else {
				table.services[table.services.length - 1].orders.push(order)
			}
			table.save((err: any, updatedTable: ITable) => {
				console.log(updatedTable);
				if (err) {
					const msg = `DB error: ${err._message}`;
					next({ statusCode: 500, error: true, errormessage: msg });
				}
				res.status(200).json({ table: updatedTable })
			});
		})
		.catch((err: any) => {
			let msg: string;
			if (err._message)
				msg = `DB error: ${err._message}`;
			else
				msg = err;
			next({ statusCode: 500, error: true, errormessage: msg });
		});
}

// This controller should be used to mark an order as processed or to log preparation time of an item
// WARN: can be used only with services not already done (what's the sense of using it with a service already done?)
// UPDATE: this controller should be now accesible only by cooks and cashdesks
//         In order to add items or to update item quantity, waiter should be use "updateMany" controller
export const update: Handler = (req, res, next) => {
	const tableNumber: number = parseInt(req.params.tableNumber, 10);
  const orderId: Schema.Types.ObjectId = new Schema.Types.ObjectId(req.params.orderId);
	const updatedInfo: any = req.body.updatedInfo ? JSON.parse(req.body.updatedInfo) : {};
  const updateBlock: any = {};
	const user: IUser = new User(req.user);

	if (updatedInfo && 'items' in updatedInfo) {
		updateBlock.items = updatedInfo.items.map(parseItemsForUpdate);
	}

	if ("processed" in req.body) {
		if (req.body.processed) {
			updateBlock.processed = Date.now();
		} else {
			updateBlock.processed = null;
		}
	}

	// update table
	Table.findOne({
		number: tableNumber
	})
		.then(table => {
			if (table && table.services && table.services.length > 0) {
				const lastServiceIndex = table.services.length - 1;
				// all updates should be made only if last service is not already done
				if (!table.services[lastServiceIndex].done) {
					const activeServiceOrders = table.services[lastServiceIndex].orders;
					const orderIndex = activeServiceOrders.findIndex((order: IOrder) => order._id ===  orderId);
					// real update for all keys contained in updateBlock
					Object.keys(updateBlock).forEach((key: string) => {
						table.services[lastServiceIndex].orders[orderIndex][key] = updateBlock[key];
					});
					table.save((err, updatedTable: ITable) => {
						if (!!req.body.processed) {
							pushNotice(user.id, updatedTable.services[lastServiceIndex].waiter, `One order for table number ${updatedTable.number} is ready to be served`, () => {
								SocketHelper.emitToUser(updatedTable.services[lastServiceIndex].waiter, 'orderProcessed');
							});
						}
						return err ? next({ statusCode: 500, error: true, errormessage: err }) : res.status(200).json({ table: updatedTable });
					});
				} else {
					return next({ statusCode: 400, error: true, errormessage: `There is no updatable service for table ${table.number}` });
				}
			} else {
				return next({ statusCode: 400, error: true, errormessage: "Wrong params" });
			}
		})
		.catch(err => {
			const msg = `DB error: ${err}`;
			next({ statusCode: 500, error: true, errormessage: msg });
		});
}

export const remove: Handler = (req, res, next) => {
	const tableNumber = req.params.tableNumber;
	const orderId = req.params.orderId;

	Table.findOne({number: tableNumber})
		.then(table => {
			if (table && table.services && table.services.length > 0) {
				const lastServiceIndex = table.services.length - 1;
				table.services[lastServiceIndex].orders = table.services[lastServiceIndex].orders.filter((order: IOrder) => {
					return `${order._id}` !== orderId;
				});
				table.save((err: any, updatedTable: ITable) => {
					if (err) {
						const msg = `DB error: ${err}`;
						return next({ statusCode: 500, error: true, errormessage: msg });
					}
					console.log(updatedTable);
					return res.status(200).json({ table: updatedTable });
				})
			} else {
				return next({ statusCode: 404, error: true, errormessage: "Table or order not found" });
			}
		});
}

function parseItemsForUpdate(item:any) {
	const allowedItemParams = ["cook", "start", "end"];
	const response: any = {};
	allowedItemParams.forEach(key => {
		if (item[key]) {
			response[key] = item[key];
		}
	});
	return response;
}
