import { Router } from 'express'
import * as controller from '../controllers/order'

const orders = Router({mergeParams: true});

orders.route('/')
  .post(controller.create)

orders.route('/pending-orders/')
  .get(controller.getAll)
  .delete(controller.emptyPendingOrdersList)

orders.route('/pending-orders/:orderId')
  .get(controller.get)
  .put(controller.update)
  .delete(controller.remove)

orders.route('/pending-orders/:orderId/done')
  .put(controller.update)

export default orders