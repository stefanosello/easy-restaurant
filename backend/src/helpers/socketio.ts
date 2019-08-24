import { Server } from 'http';
const socketio = require("socket.io");
const socketioJwt = require("socketio-jwt");

let io: any = null;
let userIdToSocket: any = { };

function setSocketInstance(server: Server) {
  if (!io) {
    io = socketio(server);

    io.on('connection', socketioJwt.authorize({
      secret: process.env.JWT_SECRET,
      timeout: 15000 // 15 seconds to send the authentication message
    })).on('authenticated', (socket: any) => {
      //this socket is authenticated, we are good to handle more events from it.
      console.log('hello! ' + socket.decoded_token.name);
    });
  }
}

function getSocketInstance() {
  return io;
}

export { setSocketInstance, getSocketInstance };