import { Handler } from 'express'
import jwt from 'jsonwebtoken';
import User from '../models/user'

const logout: Handler = async (req, res, next) => {

  let session = req.body.token;
  let payload = <any>jwt.verify(session, process.env.JWT_SECRET!, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err)
      next({ statusCode: 401, error: true, errormessage: "Unauthorized" });
    else
      return decoded;
  });

  console.log("devo cancellare: " + payload.token)

  User.updateOne(
    { username: req.user.username },
    { $pull: { sessions: { token: payload.token } } }
  ).then(() => {
    return res.status(200).json({ error: false, errormessage: "", result: "User succesfully logged out" });
  }).catch(err => {
    next({ statusCode: 500, error: true, errormessage: err });
  })
}

export default logout;