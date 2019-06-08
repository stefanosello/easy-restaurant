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

  get(number: number) {
    let table = this.http.get<any>(`${this.baseUrl}/${number}`, { responseType: 'json' })
    console.log("Table observable: " + JSON.stringify(table));
    return table;
  }

  getAll() {
    let tables = this.http.get<any>(`${this.baseUrl}`, { responseType: 'json' })
    console.log(tables)
    return tables;
  }

  getBill(tableNumber: number) {
    let bill = this.http.get<any>(`${this.baseUrl}/${tableNumber}/bill`, { responseType: 'json' })
    console.log(bill)
    return bill;
  }

  doTablePayment(table: Table) {
    let paymentDone = this.http.patch(`${this.baseUrl}/${table.number}`, table);
    console.log(paymentDone);
    return paymentDone;
  }

}