import { Server } from 'http';
import { cloneDeep } from 'lodash';
const socketio = require("socket.io");
const jwt = require('jsonwebtoken');


export default (function SocketIoHelper() {
  let io: any = null;
  let userIdToSocket: any = { };
  
  function setSocketInstance(server: Server) {
    if (!io) {
      io = socketio(server).of('/api/v1');
      io
        .use((socket: any, next: any) => {
          if (socket.handshake.query && socket.handshake.query.token){
            jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err: any, decoded: any) => {
              if (err) {
                return next(new Error('Authentication error'));
              }
              socket.decoded = decoded;
              next();
            });
          } else {
            next(new Error('Authentication error'));
          }    
        })
        .on('connection', (socket: any) => {
          // Connection now authenticated to receive further events
          userIdToSocket[socket.decoded.id] = socket;
          socket.emit('connected', { userId: socket.decoded.id, socket: socket.id });
          console.info(`User with id ${socket.decoded.id} connected to socket with id ${socket.id}`);
        });
    }
  }
  
  function getSocketFromUserId(userId: string) {
    const userSocket = userIdToSocket[userId];
    if (userSocket) {
      return cloneDeep(userSocket);
    } else {
      throw new Error(`Socket.io ERROR: user with id ${userId} has no socket associated`);
    }
  }
  
  function disconnectSocket(userId: string) {
    const userSocket = userIdToSocket[userId];
    if (userSocket) {
      delete userIdToSocket[userId];
      userSocket.disconnect();
      console.info(`User with id ${userId} disconnected`);
    } else {
      throw new Error(`Socket.io ERROR: user with id ${userId} has no socket associated`);
    }
  }

  function emitToUser(userId: string, eventName: string, data?: any) {
    let socket = getSocketFromUserId(userId);
    const message = !!data ? data : '';
    socket.emit(eventName, data);  
  }

  return { setSocketInstance, disconnectSocket, emitToUser };
})();