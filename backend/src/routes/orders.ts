import { Router } from 'express'
import * as controller from '../controllers/order'

const orders = Router({mergeParams: true});

orders.route('/')
  .get(controller.getAll)
  .post(controller.create)

orders.route('/:orderId')
  .get(controller.get)
  .put(controller.update)
  .patch(controller.updatePartial)
  .delete(controller.remove)

export default orders