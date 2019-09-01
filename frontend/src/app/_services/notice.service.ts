import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  baseUrl = environment.api + '/notices';

  constructor(private http: HttpClient) { }

  get(limit?: number) {
    const url = limit ? `${this.baseUrl}?limit=${limit}` : this.baseUrl;
    return this.http.get(url);
  }

  drop(noticeId) {
    const url =`${this.baseUrl}/${noticeId}`;
    return this.http.delete(url);
  }
}
