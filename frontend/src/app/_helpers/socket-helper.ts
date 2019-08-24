import io from 'socket.io-client';
import { environment } from '../../environments/environment';

let socket: any = null;
const token = window.localStorage.getItem('token');

export function setSocketInstance() {
  if (!socket) {
    socket = io.connect(environment.api);
    socket.on('connect', (sck) => {
      sck
        .on('authenticated', () => {
          console.log('authenticated');
        })
        .emit('authenticate', {token}); // send the jwt
    });
  }
}

export function getSocketInstance() {
  return socket;
}
