import { Component, OnInit, TemplateRef } from '@angular/core';
import { Table} from '../_models/table';
import { TableService } from '../_services/table.service';
import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { jsonSyntaxHighlight } from '../_helpers/utils'
import { activeService, foodOrders, beverageOrders, pendingBeverageOrders, pendingFoodOrders, processedFoodOrders, processedBeverageOrders } from '../_helpers/table-helper';


@Component({
  selector: 'app-cashdesk',
  templateUrl: './cashdesk.component.html',
  styleUrls: ['./cashdesk.component.scss']
})

export class CashdeskComponent implements OnInit {

  public tables: Table[];
  public modalRef: BsModalRef;
  public modalTable: Table;
  public modalTableBill: any;
  public activeService = activeService;
  public foodOrders = foodOrders;
  public beverageOrders = beverageOrders;
  public processedFoodOrders = processedFoodOrders;
  public processedBeverageOrders = processedBeverageOrders;
  public pendingFoodOrders = pendingFoodOrders;
  public pendingBeverageOrders = pendingBeverageOrders;

  constructor(
    private tableService: TableService, 
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getTables();
  }

  public openModal(template: TemplateRef<any>, $event: Table, bill: Boolean) {
    this.modalTable = $event;
    // if the opening modal is the bill one, let's retrieve the bill info
    if (bill === true) {
      this.getBill($event);
    }
    this.modalRef = this.modalService.show(template);
  }

  public getTables() {
    const tableObs: Observable<any> = this.tableService.getAll();
    tableObs.subscribe(data => {
      this.tables = data.tables;
      console.log(data);
    });
  }

  public getGeneralInfo(table: Table) {
    return jsonSyntaxHighlight(table);
  }

  public getCurrentTime() {
    let now: Date = new Date(Date.now())
    return `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  }

  public getBill(table: Table) {
    const billObs: Observable<any> = this.tableService.getBill(table.number);
    billObs.subscribe(data => {
      this.modalTableBill = data;
      console.log(data);
    });
  }

  public tablePayment(table: Table) {
    const actualBill: any = this.modalTableBill;
    const tablePaymentObs: Observable<any> = this.tableService.doTablePayment(table);
    let component = this;
    this.modalTableBill = null;
    tablePaymentObs.subscribe(
      data => { console.log(data) },
      err => { 
        console.error(err);
        component.modalTableBill = actualBill;
      },
      () => { 
        component.modalRef.hide();
        component.getTables();
      }
    )
  }

  public parseDate(date: string) {
    let d = new Date(date);
    let hours: string = d.getHours()/10 >= 1 ? `${d.getHours()}` : `0${d.getHours()}`;
    let minutes: string = d.getMinutes()/10 >= 1 ? `${d.getMinutes()}` : `0${d.getMinutes()}`;
    return `${hours}:${minutes}`
  }

}
