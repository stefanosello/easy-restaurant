import { Handler } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const renew: Handler = async (req, res, next) => {

  let newToken: string;

  let session = req.headers!['authorization']!.split(" ")[1];
  let payload = <any>jwt.verify(session, process.env.JWT_SECRET!, { algorithms: ['HS256'] }, (err, decoded) => {
    if (!err) return decoded;
  });

  if (!payload)
    return next({ statusCode: 401, error: true, errormessage: "Unauthorized" });

  let user = await User.findOne(
    { "username": payload.username, "sessions.token": payload.token },
    { "sessions.$": 1 }
  ).then(user => {
    return user;
  });

  if (!user)
    return next({ statusCode: 401, error: true, errormessage: "Unauthorized" });

  newToken = user.generateToken();
  res.status(200).json({
    error: false,
    errormessage: "",
    token: newToken,
    session: session
  });
}

export default renew;