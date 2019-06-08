import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  // These parameters are needed to handle spammed requests
  isRefreshing = false;
  refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthService) { }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available

    if (!this.isRefreshing) {
      let token = JSON.parse(localStorage.getItem('token'));
      if (token)
        request = this.addToken(request, token);
    }

    return next.handle(request)
      .pipe(
        catchError(error => {
          if (error.status == 401) {
            return this.handle401Error(request, next);
          } else {
            throwError(error)
          }
        }));
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null)

      return this.authService.refreshToken().pipe(
        switchMap(token => {
          if (token) {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token);
            // refresh page with new access token
            return next.handle(this.addToken(request, token));
          }
          this.authService.logout();
          return next.handle(request);
        })
      )
    }
    else {
      // If refresh is already in progress, take a response if found and kill the others
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt))
        })
      )
    }
  }
}