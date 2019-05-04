import { Handler } from 'express'
import User from '../models/user'

const register: Handler = (req, res, next) => {
  if (!req.body.password) {
    return next({ statusCode: 404, error: true, errormessage: "Password field missing" });
  }

  let newUser = new User({
    username: req.body.username,
    role: req.body.role
  });
  newUser.setPassword(req.body.password)

  newUser.save()
    .then(data => res.status(200).json({ error: false, errormessage: "", id: data._id }))
    .catch(err => {
      let msg = "DB error: " + err.errmsg
      if (err.code === 11000)
        msg = "User already exists"
      return next({ statusCode: 400, error: true, errormessage: msg });
    });
}

export default register