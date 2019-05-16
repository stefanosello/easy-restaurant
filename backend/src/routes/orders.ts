import { Router } from 'express'
import * as controller from '../controllers/order'

const orders = Router({mergeParams: true});

orders.route('/pending-orders/')
  .get(controller.getAll)
  .post(controller.create)
  .delete(controller.emptyPendingOrdersList)

orders.route('/pending-orders/:orderId')
  .get(controller.get)
  .put(controller.update)
  .delete(controller.remove)

export default orders