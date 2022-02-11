import { Handler } from 'express'
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user'
import SocketIoHelper from '../helpers/socketio';

const logout: Handler = async (req, res, next) => {

  const session = req.body.session;

  const payload = jwt.verify(session, process.env.JWT_SECRET!, { algorithms: ['HS256'], ignoreExpiration: true  }, (err, decoded) => {
    if (err)
      return next({ statusCode: 401, error: true, errormessage: "Unauthorized" });
    else
      return decoded;
  }) as any;

  const user: IUser = new User(req.user);
  User.updateOne(
    { username: user.username },
    { $pull: { sessions: { token: payload.token } } }
  )
  .then(() => {
    try {
      SocketIoHelper.disconnectSocket(payload.id);
    } catch (e) {
      console.error(e);
    }
    res.status(200).json({ error: false, errormessage: "", result: "User succesfully logged out" })
  })
  .catch(err => next({ statusCode: 500, error: true, errormessage: err }))
}

export default logout;