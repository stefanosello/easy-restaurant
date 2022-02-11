import { Handler } from 'express';
import SocketIoHelper from '../helpers/socketio'
import { pushNotice } from '../helpers/notice';
import User, { IUser } from '../models/user';

export const emit: Handler = async (req, res, _) => {
  const userId = req.body.userId;
  const eventName = req.body.eventName;
  const room = req.body.room;
  const message = req.body.message;
  const user: IUser = new User(req.user);
  pushNotice(user.id, userId ? userId : room, message, () => {
    if (!!userId) {
      SocketIoHelper.emitToUser(userId, eventName);
    }
    if (!!room) {
      SocketIoHelper.emitToRoom(room, eventName);
    }
  });
  res.status(202).end();
}