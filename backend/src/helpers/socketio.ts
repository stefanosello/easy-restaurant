import { Server } from 'http';
import { cloneDeep } from 'lodash';
const socketio = require("socket.io");
const jwt = require('jsonwebtoken');

let io: any = null;
let userIdToSocket: any = { };

function setSocketInstance(server: Server) {
  if (!io) {
    io = socketio(server);
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
        console.info(`User with id ${socket.decoded.id} connected to socket with id ${socket.id}`);
      });
  }
}

function getSocketInstance() {
  return cloneDeep(io);
}

function getUserIdToSocketMap() {
  return cloneDeep(userIdToSocket);
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

export { setSocketInstance, getSocketInstance, disconnectSocket };