import { Handler } from 'express';
import SocketIoHelper from '../helpers/socketio'

export const emit: Handler = async (req, res, next) => {
  const userId = req.body.userId;
  const eventName = req.body.eventName;
  const room = req.body.room;
  if (!!userId) {
    SocketIoHelper.emitToUser(userId, eventName);
  }
  if (!!room) {
    SocketIoHelper.emitToRoom(room, eventName);
  }
  res.status(202).end();
}