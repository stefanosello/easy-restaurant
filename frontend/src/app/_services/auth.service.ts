import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { map, tap, mapTo, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, Roles } from '../_models/user';
import jwtDecode from 'jwt-decode';
import SocketHelper from '../_helpers/socket-helper';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.api;
  private readonly JWT_TOKEN = 'token';
  private readonly REFRESH_TOKEN = 'session';
  private _user: User;

  constructor(private http: HttpClient,
    private router: Router) { }

  get loggedUser() {
    if (!this._user) this._user = this.getUserInfo();
    return this._user
  }

  get tokens() {
    return {
      jwt: localStorage.getItem(this.JWT_TOKEN),
      refresh: localStorage.getItem(this.REFRESH_TOKEN)
    }
  }

  login(username: string, password: string) {
    const endpoint = this.baseUrl + '/login';
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + btoa(`${username}:${password}`));
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<any>(endpoint, {}, { headers })
      .pipe(
        tap(tokens => this.doLoginUser(tokens)),
        mapTo(true),
        catchError(error => of(false)));
  }

  logout() {
    const endpoint = this.baseUrl + '/logout';
    return this.http.post<any>(endpoint, { session: this.tokens.refresh })
      .pipe(
        tap(() => {
          SocketHelper.clearSocket();
          this.doLogoutUser()
        }),
        mapTo(true),
        catchError(error => of(false)));
  }

  refreshToken() {
    const endpoint = this.baseUrl + '/renew';
    return this.http.post<any>(endpoint, { session: this.tokens.refresh });
  }

  private doLoginUser(tokens) {
    this.storeTokens(tokens);
    this._user = this.getUserInfo();
  }

  private doLogoutUser() {
    this._user = null;
    this.removeTokens();
  }

  isLoggedIn() {
    return !!this.tokens.jwt;
  }

  isTokenExpired(): boolean {
    const token = this.tokens.jwt;
    if (!token) return true;
    const decoded = jwtDecode(token);
    const date = new Date(0).setUTCSeconds(decoded.exp);
    if (date === undefined) return false;

    if (date.valueOf() < new Date().valueOf()) {
      this.refreshToken();
    }
    return false;
  }

  storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.session);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  getUserInfo(): User {
    const payload = jwtDecode(this.tokens.jwt);
    const user = new User();
    user.username = payload.username;
    user.role = payload.role;
    user._id = payload.id;
    return user;
  }
}
