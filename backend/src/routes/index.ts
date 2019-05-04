import { Router } from 'express'
import loginController from '../controllers/login'
import * as authController from '../controllers/auth'
import * as userController from '../controllers/user'
import usersRoutes from './users'

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

  // Every other page requires access
  .use(authController.token)

  // Routes
  .use('/users', authController.admin, usersRoutes)
  .use('/tables', (req, res, next) => res.send('Tables endpoint'))
  .use('/orders', (req, res, next) => res.send('Orders endpoint'))

export default router;