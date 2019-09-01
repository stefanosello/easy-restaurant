import io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { SocketioService } from '../_services/socketio.service';

// tslint:disable-next-line: only-arrow-functions
export default (function() {
  let socket: any = null;
  let registeredEvents: string[] = [];

  function setSocketInstance(jwtToken?: string) {
    if (!socket) {
      const token = jwtToken ? jwtToken : window.localStorage.getItem('token');
      socket = io.connect(`${environment.api}?token=${token.split('"')[1]}`);
      registerEvent('connected', (message) => {
        console.log(`Socket succesfully connected with message: ${ message }`, registeredEvents);
      });
    }
  }

  function registerEvent(eventName, callback) {
    setSocketInstance();
    if (!registeredEvents.find(ev => eventName === ev)) {
      registeredEvents.push(eventName);
      socket.on(eventName, callback);
    } else {
      console.log('Event already registered');
    }
  }

  function clearSocket() {
    registeredEvents = [];
    socket = null;
    console.log('Socket disconnected');
  }

  function getSocketInstance() {
    setSocketInstance();
    return socket;
  }

  function emitEvent(SocketService: SocketioService, eventName: string, userId?: string, room?: string, message?: string) {
    setSocketInstance();
    SocketService.notifyToUser(eventName, userId, room, message).subscribe(
      (_) => {},
      (err) => console.error(err),
      () => {}
    );
  }

  return { setSocketInstance, clearSocket, getSocketInstance, registerEvent, emitEvent };

})();
