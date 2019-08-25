import { Handler } from 'express';
import SocketIoHelper from '../helpers/socketio'

export const emit: Handler = async (req, res, next) => {
  const receiver = req.body.receiver;
  const eventName = req.body.eventName;
  SocketIoHelper.emitToUser(receiver, eventName);
  res.status(202).end();
}