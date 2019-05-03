import { Router } from 'express'
import jwt from 'express-jwt'
import passport from 'passport'
import Http from 'passport-http'
import login from '../controllers/login'
import * as user from '../models/user';

const auth = jwt({ secret: process.env.JWT_SECRET! });

const router = Router();

passport.use(new Http.BasicStrategy(
  function (username, password, done) {
    user.getModel().findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.validatePassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

router
  // Root and login pages are public
  .get('/', (req, res, next) => res.send('Hello world!'))
  .get("/login", passport.authenticate('basic', { session: false }), login)

  // Every other page requires access
  .use(auth)
  .get('/users', (req, res, next) => res.send('User endpoint'))
  .get('/tables', (req, res, next) => res.send('Tables endpoint'))
  .get('/orders', (req, res, next) => res.send('Orders endpoint'))

export default router;