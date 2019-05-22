import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa(`${username}:${password}`));
    headers = headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http.post<any>(`http://localhost:8080/login`, {}, { headers })
      .pipe(map(response => {
        // login successful if there's a jwt token in the response
        if (response && response.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', JSON.stringify(response));
        }
        return response.token;
      }));
  }
}
