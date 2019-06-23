import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TableService } from 'src/app/_services/table.service';
import { FormControl, Validators } from '@angular/forms';
import { Table } from 'src/app/_models/table';
import { AuthService } from 'src/app/_services/auth.service';
import { foodOrders, beverageOrders, pendingBeverageOrders, pendingFoodOrders, processedFoodOrders, processedBeverageOrders } from '../../_helpers/table-helper';


@Component({
  selector: 'app-waiter-order-modal',
  templateUrl: './waiter-order-modal.component.html',
  styleUrls: ['./waiter-order-modal.component.scss']
})
export class WaiterOrderModalComponent implements OnInit {

  public numberOfCovers = new FormControl('', [Validators.required, Validators.min(1)]);
  public table: Table;
  public foodOrders = foodOrders;
  public beverageOrders = beverageOrders;
  public processedFoodOrders = processedFoodOrders;
  public processedBeverageOrders = processedBeverageOrders;
  public pendingFoodOrders = pendingFoodOrders;
  public pendingBeverageOrders = pendingBeverageOrders;

  constructor(
    public dialogRef: MatDialogRef<WaiterOrderModalComponent>,
    private tableService: TableService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: Table
  ) { }

  ngOnInit() {
    this.table = this.data;
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

}
