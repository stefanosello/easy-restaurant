import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.api + '/users';

  getAll(params?: any) {
    let url = `${this.baseUrl}`;
    if (!!params) {
      url = `${url}?`;
      Object.keys(params).forEach((key, index) => {
        url = `${url}${key}=${params[key]}`;
        if (index < (Object.keys(params).length - 1)) {
          url = `${url}&&`;
        }
      });
    }
    const users = this.http.get<any>(url, { responseType: 'json' });
    return users;
  }

  delete(user) {
    const url = `${this.baseUrl}/${user.username}`;
    return this.http.delete<any>(url);
  }

  get(user) {
    const url = `${this.baseUrl}/${user.username}`;
    return this.http.get<any>(url, { responseType: 'json' });
  }

  create(user) {
    const url = `${this.baseUrl}`
    return this.http.post<any>(url, user);
  }

  update(user) {
    const url = `${this.baseUrl}/${user.username}`;
    return this.http.put<any>(url, user);
  }
}
