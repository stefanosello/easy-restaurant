import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TableService } from 'src/app/_services/table.service';
import { FormControl, Validators } from '@angular/forms';
import { Table } from 'src/app/_models/table';
import { AuthService } from 'src/app/_services/auth.service';
// tslint:disable-next-line: max-line-length
import { foodOrders, beverageOrders, pendingBeverageOrders, pendingFoodOrders, processedFoodOrders, processedBeverageOrders } from '../../_helpers/table-helper';
import { Item } from 'src/app/_models/order';

export interface ItemNode {
  name: string;
  quantity: number;
  children?: ItemNode[];
}

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
    this.formattedFoodOrders = this.formatOrdersForTree().foodOrders;
    this.formattedBeverageOrders = this.formatOrdersForTree().beverageOrders;
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  private formatOrdersForTree(): { foodOrders: ItemNode, beverageOrders: ItemNode } {
    const foodOrders: ItemNode = {
      name: 'Food Orders',
      quantity: this.foodOrders(this.table).length,
      children: []
    };
    this.foodOrders(this.table).forEach((order, index) => {
      const formattedOrder: ItemNode = {
        name: `Order #${index}`,
        quantity: order.items.length,
        children: []
      };
      order.items.forEach((item: Item) => {
        formattedOrder.children.push({
          name: item.item.name,
          quantity: item.quantity
        });
      });
      foodOrders.children.push(formattedOrder);
    });
    const beverageOrders: ItemNode = {
      name: 'Beverage Orders',
      quantity: this.beverageOrders(this.table).length,
      children: []
    };
    this.beverageOrders(this.table).forEach((order, index) => {
      const formattedOrder: ItemNode = {
        name: `Order #${index}`,
        quantity: order.items.length,
        children: []
      };
      order.items.forEach((item: Item) => {
        formattedOrder.children.push({
          name: item.item.name,
          quantity: item.quantity
        });
      });
      beverageOrders.children.push(formattedOrder);
    });
    return { foodOrders, beverageOrders };
  }

}
