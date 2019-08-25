import io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

// tslint:disable-next-line: only-arrow-functions
export default (function() {
  let socket: any = null;
  let registeredEvents: string[] = [];

  function setSocketInstance(token) {
    if (!socket) {
      socket = io.connect(`${environment.api}?token=${token.split('"')[1]}`);
    }
    registerEvent('connected', (message) => {
      console.log(`Socket succesfully connected with message: ${ message }`, registeredEvents);
    });
  }

  function registerEvent(eventName, callback) {
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
    return socket;
  }

  return { setSocketInstance, clearSocket, getSocketInstance, registerEvent };

})();
