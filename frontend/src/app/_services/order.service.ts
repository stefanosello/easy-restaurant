import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../_models/order';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = environment.api + '/orders';
  tables: Order[];

  constructor(private http: HttpClient) { }

  // TODO: must return populated items?
  get(id: string) { }

  // TODO: must return populated items?
  getAll(params: { type: string, processed: boolean, populate: boolean }) {
    let query = `type=${params.type}&processed=${params.processed}&populate=${params.populate}`;
    let orders = this.http.get<any>(`${this.baseUrl}?${query}`, { responseType: 'json' })
    console.log(orders)
    return orders;
  }
}
