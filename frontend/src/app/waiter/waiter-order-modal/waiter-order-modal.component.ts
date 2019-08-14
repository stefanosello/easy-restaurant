import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TableService } from 'src/app/_services/table.service';
import { FormControl, Validators } from '@angular/forms';
import { Table } from 'src/app/_models/table';
import { AuthService } from 'src/app/_services/auth.service';
// tslint:disable-next-line: max-line-length
import { foodOrders, beverageOrders, pendingBeverageOrders, pendingFoodOrders, processedFoodOrders, processedBeverageOrders } from '../../_helpers/table-helper';
import { Item } from 'src/app/_models/order';
import { ItemNode, formatOrdersForTree } from 'src/app/_helpers/order-tree-helper';

@Component({
  selector: 'app-waiter-order-modal',
  templateUrl: './waiter-order-modal.component.html',
  styleUrls: ['./waiter-order-modal.component.scss']
})
export class WaiterOrderModalComponent implements OnInit {

  private formatOrdersForTree = formatOrdersForTree;
  public numberOfCovers = new FormControl('', [Validators.required, Validators.min(1)]);
  public table: Table;
  public foodOrders = foodOrders;
  public beverageOrders = beverageOrders;
  public processedFoodOrders = processedFoodOrders;
  public processedBeverageOrders = processedBeverageOrders;
  public pendingFoodOrders = pendingFoodOrders;
  public pendingBeverageOrders = pendingBeverageOrders;
  public formattedFoodOrders: any;
  public formattedBeverageOrders: any;

  constructor(
    public dialogRef: MatDialogRef<WaiterOrderModalComponent>,
    private tableService: TableService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: Table
  ) { }

  ngOnInit() {
    this.table = this.data;
    this.formattedFoodOrders = this.formatOrdersForTree(this.foodOrders(this.table), 'Food Orders');
    this.formattedBeverageOrders = this.formatOrdersForTree(this.beverageOrders(this.table), 'Beverage Orders');
    console.log(this.table);
  }

  public onNoClick(): void {
    console.log(this.formattedFoodOrders);
    this.dialogRef.close();
  }

}
