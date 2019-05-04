import { Router } from 'express'
import login from '../controllers/login'
import register from '../controllers/register'
import * as Auth from '../controllers/auth'

const router = Router();

router
  // Root and login pages are public
  .get('/', (req, res) => res.status(200).json(
    {
      api_version: "1.0",
      endpoints: ["/login", "/register", "/users"]
    }
  ))
  .post('/register', register)
  .post('/login', Auth.credentials, login)

  // Every other page requires access
  .use(Auth.token)

  // Routes
  .get('/users', Auth.admin, (req, res, next) => res.send('User endpoint'))
  .get('/tables', (req, res, next) => res.send('Tables endpoint'))
  .get('/orders', (req, res, next) => res.send('Orders endpoint'))

export default router;