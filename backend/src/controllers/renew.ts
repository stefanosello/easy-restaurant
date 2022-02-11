import { Handler } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

const renew: Handler = async (req, res, next) => {

  const token = req.headers!.authorization!.split(" ")[1];
  const session = req.body.session;

  // Read authorization token from header
  const tokenPayload = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'], ignoreExpiration: true }, (err, decoded) => {
    if (!err) return decoded;
  }) as any;
  // Read refresh token from body
  const sessionPayload = jwt.verify(session, process.env.JWT_SECRET!, { algorithms: ['HS256'], ignoreExpiration: true }, (err, decoded) => {
    if (!err) return decoded
  }) as any;

  // Check that both tokens belong to the same user
  if (!tokenPayload || !sessionPayload || tokenPayload.username !== sessionPayload.username)
    return next({ statusCode: 401, error: true, errormessage: "Unauthorized" });

  const user: IUser = await User.findOne({ "username": sessionPayload.username, "sessions.token": sessionPayload.token });

  // If user is not found, user does not exists or refresh token is not valid anymore
  if (!user) return next({ statusCode: 401, error: true, errormessage: "Unauthorized" });

  // Generate a new authorization token token for the user
  const newToken = user.generateToken();
  res.status(200).json({
    error: false,
    errormessage: "",
    token: newToken,
    session
  });
}

export default renew;