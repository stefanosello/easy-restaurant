import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, Roles } from '../_models/user';
import jwtDecode from 'jwt-decode';
import * as SocketHelper from '../_helpers/socket-helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.api;

  constructor(private http: HttpClient,
              private router: Router) { }

  login(username: string, password: string) {
    const endpoint = this.baseUrl + '/login';
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + btoa(`${username}:${password}`));
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post<any>(endpoint, {}, { headers })
      .pipe(map(response => {
        // login successful if there's a jwt token in the response
        if (response && response.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', JSON.stringify(response.token));
        }
        if (response && response.session) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('session', JSON.stringify(response.session));
        }
        return response.token;
      }));
  }

  logout() {
    const endpoint = this.baseUrl + '/logout';
    const refresh = JSON.parse(localStorage.getItem('session'));
    this.http.post<any>(endpoint, { token: refresh }).toPromise()
      .then(response => {
        if (response && !response.error) {
          SocketHelper.clearSocket();
          localStorage.removeItem('token');
          localStorage.removeItem('session');
          this.router.navigate(['/login']);
        } else {
          console.log('ERRORE');
        }
      });
  }

  refreshToken() {
    const endpoint = this.baseUrl + '/renew';
    const refresh = JSON.parse(localStorage.getItem('session'));

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + refresh);
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post<any>(endpoint, {}, { headers })
      .pipe(map(response => {
        // refresh successful if there's a jwt token in the response
        if (response && response.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', JSON.stringify(response.token));
        }
        return response.token;
      }));
  }

  getUserInfo(): User {
    const token = localStorage.getItem('token');
    try {
      const payload = jwtDecode(token);
      const user = new User();
      user.username = payload.username;
      user.role = payload.role;
      user._id = payload.id;
      user.token = token;
      return user;
    } catch (Error) {
      return null;
    }
  }
}
