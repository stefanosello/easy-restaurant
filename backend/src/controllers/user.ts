import { Handler } from 'express'
import User from '../models/user'

export const getAll: Handler = (req, res, next) => {
  User.find(req.query, {
    digest: false,
    salt: false,
    __v: false
  })
    .then(users => {
      return res.status(200).json({ users, links: [{ href: req.baseUrl, rel: "self" }] })
    })
    .catch(err => {
      return next({ statusCode: 404, error: true, errormessage: `DB error: ${err}` });
    })
}

export const get: Handler = (req, res, next) => {
  User.findOne({ username: req.params.username }, { digest: false, salt: false, __v: false })
    .then(user => {
      return res.status(200).json({ user, links: [{ href: req.baseUrl, rel: "self" }] })
    })
    .catch(err => {
      return next({ statusCode: 404, error: true, errormessage: `DB error: ${err}` });
    })
}

export const create: Handler = (req, res, next) => {
  if (!req.body.username) {
    return next({ statusCode: 404, error: true, errormessage: "Username field missing" });
  }
  if (!req.body.password) {
    return next({ statusCode: 404, error: true, errormessage: "Password field missing" });
  }

  let user = new User({
    username: req.body.username,
    role: req.body.role,
    name: {
      first: req.body.firstName,
      last: req.body.lastName
    }
  })

  user.setPassword(req.body.password)

  user.save()
    .then(data => res.status(200).json({ error: false, errormessage: "", id: data._id }))
    .catch(err => {
      let msg = "DB error: " + err.errmsg
      if (err.code === 11000)
        msg = "User already exists"
      return next({ statusCode: 400, error: true, errormessage: msg });
    });
}

export const update: Handler = (req, res, next) => {}
export const updatePartial: Handler = (req, res, next) => {}
export const remove: Handler = (req, res, next) => {}