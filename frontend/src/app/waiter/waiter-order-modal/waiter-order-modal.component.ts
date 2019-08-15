import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TableService } from 'src/app/_services/table.service';
import { FormControl, Validators } from '@angular/forms';
import { Table } from 'src/app/_models/table';
import { AuthService } from 'src/app/_services/auth.service';
import { pendingBeverageOrders, pendingFoodOrders } from '../../_helpers/table-helper';
import { formatOrdersForTree, formatTreeForDB, formatOrderNodeForTree } from 'src/app/_helpers/order-tree-helper';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-waiter-order-modal',
  templateUrl: './waiter-order-modal.component.html',
  styleUrls: ['./waiter-order-modal.component.scss']
})
export class WaiterOrderModalComponent implements OnInit {

  private formatOrdersForTree = formatOrdersForTree;
  public numberOfCovers = new FormControl('', [Validators.required, Validators.min(1)]);
  public table: Table;
  public pendingFoodOrders = pendingFoodOrders;
  public pendingBeverageOrders = pendingBeverageOrders;
  public formattedFoodOrders: any;
  public formattedBeverageOrders: any;

  constructor(
    public dialogRef: MatDialogRef<WaiterOrderModalComponent>,
    private tableService: TableService,
    private authService: AuthService,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: Table
  ) { }

  ngOnInit() {
    this.table = this.data;
    this.formattedFoodOrders = this.formatOrdersForTree(this.pendingFoodOrders(this.table), 'Food Orders');
    this.formattedBeverageOrders = this.formatOrdersForTree(this.pendingBeverageOrders(this.table), 'Beverage Orders');
    console.log(this.table);
  }

  public onNoClick(): void {
    console.log(formatTreeForDB(this.formattedFoodOrders));
    this.dialogRef.close();
  }

  public addOrder(orderType): void {
    this.orderService.createEmpty(orderType, this.table.number).subscribe(
      newOrder => {
        console.log(newOrder);
        if (orderType === this.formattedFoodOrders) {
          const index = this.formattedFoodOrders.children.length;
          this.formattedFoodOrders.children.push(formatOrderNodeForTree(newOrder, index));
        } else if (orderType === 'beverage') {
          const index = this.formattedBeverageOrders.children.length;
          this.formattedBeverageOrders.children.push(formatOrderNodeForTree(newOrder, index));
        }
      },
      err => { console.error(err); },
      () => { console.log('done'); }
    );
  }

}
