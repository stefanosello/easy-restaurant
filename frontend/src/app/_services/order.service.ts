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
    const query = `type=${params.type}&processed=${params.processed}&populate=${params.populate}`;
    const orders = this.http.get<any>(`${this.baseUrl}?${query}`, { responseType: 'json' })
    return orders;
  }

  createEmpty(orderType: string, tableNumber: number) {
    return this.http.post<any>(`${environment.api}/tables/${tableNumber}/orders`, {
      order: {
        items: [],
        type: orderType
      }
    });
  }

  delete(orderId: string, tableNumber: number) {
    return this.http.delete<any>(`${environment.api}/tables/${tableNumber}/orders/${orderId}`);
  }

}
