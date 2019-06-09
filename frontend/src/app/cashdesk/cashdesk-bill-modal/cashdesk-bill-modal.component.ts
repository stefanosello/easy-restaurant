import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Table } from 'src/app/_models/table';
import { activeService, foodOrders, beverageOrders, pendingBeverageOrders, pendingFoodOrders, processedFoodOrders, processedBeverageOrders } from '../../_helpers/table-helper';
import { Observable } from 'rxjs';
import { TableService } from 'src/app/_services/table.service';

@Component({
  selector: 'app-cashdesk-bill-modal',
  templateUrl: './cashdesk-bill-modal.component.html',
  styleUrls: ['./cashdesk-bill-modal.component.scss']
})
export class CashdeskBillModalComponent implements OnInit {

  public table: Table;
  public bill: any;
  public activeService = activeService;
  public foodOrders = foodOrders;
  public beverageOrders = beverageOrders;
  public processedFoodOrders = processedFoodOrders;
  public processedBeverageOrders = processedBeverageOrders;
  public pendingFoodOrders = pendingFoodOrders;
  public pendingBeverageOrders = pendingBeverageOrders;

  constructor(
    public dialogRef: MatDialogRef<CashdeskBillModalComponent>,
    private tableService: TableService,
    @Inject(MAT_DIALOG_DATA) public data: Table) { }

  ngOnInit() {
    this.table = this.data;
    this.getBill();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public getBill() {
    const billObs: Observable<any> = this.tableService.getBill(this.table.number);
    billObs.subscribe(data => {
      this.bill = data;
      console.log(data);
    });
  }

  public tablePayment() {
    const actualBill: any = this.bill;
    const tablePaymentObs: Observable<any> = this.tableService.doTablePayment(this.table);
    let component = this;
    this.bill = null;
    tablePaymentObs.subscribe(
      data => { console.log(data) },
      err => {
        console.error(err);
        component.bill = actualBill;
      },
      () => {
        component.dialogRef.close("paid");
      }
    )
  }

  public getCurrentTime() {
    let now: Date = new Date(Date.now())
    return `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  }

}
