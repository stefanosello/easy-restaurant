import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  getAll(itemType) {
    let requestUrl = `${environment.api}/items`;
    if (itemType) {
      requestUrl = `${requestUrl}?itemType=${itemType}`;
    }
    return this.http.get<any>(requestUrl, { responseType: 'json' });
  }

  addToOrder(item, order, quantity, tableNumber) {
    return this.http.post(`${environment.api}/tables/${tableNumber}/orders/${order._id}/items`, {
      item: {
        _id: item._id,
        quantity
      }
    });
  }

  removeFromOrder(item, order, tableNumber) {
    return this.http.delete(`${environment.api}/tables/${tableNumber}/orders/${order._id}/items/${item._id}`);
  }


}
