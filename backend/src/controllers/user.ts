import { Handler } from 'express'
import User, { Roles } from '../models/user'

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
  if (!req.body.role || !Object.values(Roles).includes(req.body.role)) {
    return next({ statusCode: 404, error: true, errormessage: "Role not valid" });
  }

  let user = User.create(req.body)
    .then(data => res.status(200).json({ error: false, errormessage: "", id: data._id }))
    .catch(err => {
      let msg = `DB error: ${err.errmsg}`
      if (err.code === 11000)
        msg = "User already exists"
      return next({ statusCode: 409, error: true, errormessage: msg });
    });
}

export const update: Handler = (req, res, next) => {
  User.findOneAndUpdate({ username: req.params.username }, req.body)
    .then(data => res.status(200).json({ error: false, errormessage: "", result: "User modified" }))
    .catch(err => {
      return next({ statusCode: 400, error: true, errormessage: `DB error: ${err.errmsg}` })
    });
}
export const updatePartial: Handler = (req, res, next) => { 
  res.status(501);
}

export const remove: Handler = (req, res, next) => {
  if (req.user.username != req.params.username) {
    User.findOneAndDelete({ username: req.params.username })
      .then(data => res.status(200).json({ error: false, errormessage: "", result: "User deleted successfully" }))
      .catch(err => {
        return next({ statusCode: 400, error: true, errormessage: `DB error: ${err.errmsg}` })
      })
  }
}