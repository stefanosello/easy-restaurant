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

  // Injects the token in the authorization header of a http request
  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Add authorization header with jwt token unless it is a repeated request while waiting for renew
    if (!this.isRefreshing || request.url.includes('/renew')) {
      const token = this.authService.tokens.jwt;
      if (token)
        request = this.addToken(request, token);
    }

    return next.handle(request)
      .pipe(
        catchError(error => {
          // If unauthorized, ask for token renew
          if (error.status == 401 && this.authService.getUserInfo()) {
            return this.handle401Error(request, next);
          } else {
            return throwError(error)
          }
        }));
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Handle only the first request, in case of spammed requests
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null)

      return this.authService.refreshToken().pipe(
        switchMap(tokens => {
          this.isRefreshing = false;
          this.authService.storeJwtToken(tokens.token)
          // Other requests will wait for this token
          this.refreshTokenSubject.next(tokens.token);
          // Refresh page with new access token
          return next.handle(this.addToken(request, tokens.token));
        }),
        catchError(err => {
          return throwError(err)
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
