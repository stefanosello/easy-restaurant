import { Router } from 'express'
import * as controller from '../controllers/table'

const tables = Router();

tables.route('/')
  .get(controller.getAll)
  .post(controller.create)

tables.route('/:tableNumber')
  .get(controller.get)
  .put(controller.update)
  .patch(controller.updatePartial)
  .delete(controller.remove)

export default tables