import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  baseUrl = environment.api + '/socket';

  constructor(private http: HttpClient) { }

  notifyToUser(eventName: string, userId?: string, room?: string) {
    return this.http.post(this.baseUrl, { eventName, userId, room });
  }
}
