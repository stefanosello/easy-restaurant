import io from 'socket.io-client';
import { Observable, observable } from 'rxjs';
import { environment } from '../../environments/environment';

let socket: any = null;

export function setSocketInstance(token) {
  if (!socket) {
    socket = io.connect(`${environment.api}?token=${token.split('"')[1]}`);
  }
}

export function clearSocket() {
  socket = null;
}

export function getSocketInstance() {
  return socket;
}
