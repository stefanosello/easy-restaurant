import { Handler } from 'express'
import User, { Roles } from '../models/user'

export const getAll: Handler = (req, res, next) => {
  User.find(req.query, { password: false })
    .then(users => res.status(200).json({ users }))
    .catch(err => next({ statusCode: 404, error: true, errormessage: `DB error: ${err}` }))
}

export const get: Handler = (req, res, next) => {
  User.findOne({ username: req.params.username }, { password: false })
    .then(user => res.status(200).json({ user }))
    .catch(err => next({ statusCode: 404, error: true, errormessage: `DB error: ${err}` }))
}

export const create: Handler = (req, res, next) => {
  if (!req.body.username)
    next({ statusCode: 404, error: true, errormessage: "Username field missing" });
  else if (!req.body.password)
    next({ statusCode: 404, error: true, errormessage: "Password field missing" });
  else if (!req.body.role || !Object.values(Roles).includes(req.body.role))
    next({ statusCode: 404, error: true, errormessage: "Role not valid" });
  else
    User.create(req.body)
      .then(user => res.status(200).json({ user }))
      .catch(err => {
        let msg = `DB error: ${err.errmsg}`
        if (err.code === 11000)
          msg = "User already exists"
        next({ statusCode: 409, error: true, errormessage: msg });
      });
}

export const update: Handler = (req, res, next) => {
  User.findOneAndUpdate({ username: req.params.username }, req.body)
    .then(user => res.status(200).json({ user }))
    .catch(err => next({ statusCode: 400, error: true, errormessage: `DB error: ${err.errmsg}` }));
}

export const updatePartial: Handler = (req, res, next) => {
  res.status(501);
}

export const remove: Handler = (req, res, next) => {
  if (req.user.username != req.params.username) {
    User.findOneAndDelete({ username: req.params.username })
      .then(data => res.status(200).json({ error: false, errormessage: "", result: "User deleted successfully" }))
      .catch(err => next({ statusCode: 400, error: true, errormessage: `DB error: ${err.errmsg}` }))
  }
}