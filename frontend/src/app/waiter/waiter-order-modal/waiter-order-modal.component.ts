import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TableService } from 'src/app/_services/table.service';
import { FormControl, Validators } from '@angular/forms';
import { Table } from 'src/app/_models/table';
import { pendingBeverageOrders, pendingFoodOrders, foodOrders, beverageOrders, getOrders } from '../../_helpers/table-helper';
import { OrderService } from 'src/app/_services/order.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-waiter-order-modal',
  templateUrl: './waiter-order-modal.component.html',
  styleUrls: ['./waiter-order-modal.component.scss']
})
export class WaiterOrderModalComponent implements OnInit {

  public numberOfCovers = new FormControl('', [Validators.required, Validators.min(1)]);
  public table: Table;
  public getOrders = getOrders;
  public showAccordion = false;
  panelOpenState = false;

  constructor(
    public dialogRef: MatDialogRef<WaiterOrderModalComponent>,
    private tableService: TableService,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: Table
  ) { }

  ngOnInit() {
    this.table = this.data;
    // this timeout is a workaround to make accordion works into tab
    setTimeout(() => {
      this.showAccordion = true;
    }, 1);
  }

  public closeClick(): void {
    this.dialogRef.close({ status: 'updated' });
  }

  public addOrder(orderType): void {
    this.orderService.createEmpty(orderType, this.table.number).subscribe(
      data => {
        this.table = data.table;
      },
      err => { console.error(err); },
      () => { console.log('order created', this.table); }
    );
  }

  public deleteOrder(orderId): void {
    this.orderService.delete(orderId, this.table.number).subscribe(
      data => {
        this.table = data.table;
      },
      err => { console.error(err); },
      () => { console.log('order deleted'); }
    );
  }

}
