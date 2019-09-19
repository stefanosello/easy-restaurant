import { Handler } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const renew: Handler = async (req, res, next) => {

  let token = req.headers!['authorization']!.split(" ")[1];
  let session = req.body.session;

  let tokenPayload = <any>jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'], ignoreExpiration: true }, (err, decoded) => {
    if (!err) return decoded;
  });
  let sessionPayload = <any>jwt.verify(session, process.env.JWT_SECRET!, { algorithms: ['HS256'], ignoreExpiration: true }, (err, decoded) => {
    if (!err) return decoded
  });

  if (!tokenPayload || !sessionPayload || tokenPayload.username != sessionPayload.username)
    return next({ statusCode: 401, error: true, errormessage: "Unauthorized" });

  let user = await User.findOne({ "username": sessionPayload.username, "sessions.token": sessionPayload.token })
    .then(user => user)
    .catch(() => null)

  if (!user)
    return next({ statusCode: 401, error: true, errormessage: "Unauthorized" });

  let newToken = user.generateToken();
  res.status(200).json({
    error: false,
    errormessage: "",
    token: newToken,
    session: session
  });
}

export default renew;