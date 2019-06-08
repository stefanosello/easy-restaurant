import { Router } from 'express'
import loginController from '../controllers/login'
import renewController from '../controllers/renew'
import * as authController from '../controllers/auth'
import * as userController from '../controllers/user'
import usersRoutes from './users'
import tablesRoutes from './tables'
import ordersRoutes from './orders'
import itemsRoutes from './items'

const router = Router();

router
  // Root and login pages are public
  .get('/', (req, res) => res.status(200).json(
    {
      api_version: "1.0",
      endpoints: ["/login", "/register", "/users"]
    }
  ))
  .post('/register', userController.create)
  .post('/login', authController.credentials, loginController)
  .post('/renew', renewController)

  // Every other page requires access
  .use(authController.token)

  // Routes
  .use('/users', usersRoutes)
  .use('/tables', tablesRoutes)
  .use('/orders', ordersRoutes)
  .use('/items', itemsRoutes)

export default router;