import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Table } from '../_models/table';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  baseUrl = environment.api + '/tables';
  tables: Table[];

  constructor(private http: HttpClient) { }

  get(tableNumber: number) {
    const table = this.http.get<any>(`${this.baseUrl}/${tableNumber}`, { responseType: 'json' });
    return table;
  }

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
    const tables = this.http.get<any>(url, { responseType: 'json' });
    return tables;
  }

  getBill(tableNumber: number) {
    const bill = this.http.get<any>(`${this.baseUrl}/${tableNumber}/bill`, { responseType: 'json' });
    return bill;
  }

  doTablePayment(table: Table) {
    const paymentDone = this.http.patch(`${this.baseUrl}/${table.number}`, table);
    return paymentDone;
  }

  addTable(data: any) {
    return this.http.post(`${this.baseUrl}/`, data);
  }

  updateTable(table: Table) {
    return this.http.put(`${this.baseUrl}/${table.number}`, table);
  }

  isTableAlreadyPresent(tableNumber: number) {
    return this.http.get(`${this.baseUrl}/validate?tableNumber=${tableNumber}`);
  }

}
