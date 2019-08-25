import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TableService } from 'src/app/_services/table.service';
import { FormControl, Validators } from '@angular/forms';
import { Table } from 'src/app/_models/table';
import { getOrders } from '../../_helpers/table-helper';
import { OrderService } from 'src/app/_services/order.service';
import { Observable } from 'rxjs';
import { ItemService } from 'src/app/_services/item.service';
import { Item } from 'src/app/_models/item';
import { startWith, map } from 'rxjs/operators';
import { Order } from 'src/app/_models/order';

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
  foodAutocomplete = new FormControl();
  beverageAutocomplete = new FormControl();
  foodOptions: Item[] = [];
  filteredFoodOptions: Observable<Item[]>;
  beverageOptions: Item[] = [];
  filteredBeverageOptions: Observable<Item[]>;
  newItemQuantity: number = undefined;
  private foodOrdersModified = false;
  private beverageOrdersModified = false;

  constructor(
    public dialogRef: MatDialogRef<WaiterOrderModalComponent>,
    private itemService: ItemService,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: Table
  ) { }

  ngOnInit() {
    this.table = this.data;
    console.log(this.data);
    this.initAutocompleteStuffs();
    // this timeout is a workaround to make accordion works into tab
    setTimeout(() => {
      this.showAccordion = true;
    }, 1);
  }

  private initAutocompleteStuffs() {
    this.itemService.getAll('food').subscribe(
      data => {
        this.foodOptions = data.items;
      },
      err => { console.error(err); },
      () => { console.log('done food options'); }
    );
    this.filteredFoodOptions = this.foodAutocomplete.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.foodOptions) : this.foodOptions.slice())
      );
    this.itemService.getAll('beverage').subscribe(
      data => {
        this.beverageOptions = data.items;
      },
      err => { console.error(err); },
      () => { console.log('done beverage options'); }
    );
    this.filteredBeverageOptions = this.beverageAutocomplete.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.beverageOptions) : this.beverageOptions.slice())
      );
  }

  private _filter(name: string, options): Item[] {
    const filterValue = name.toLowerCase();
    return options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  public displayFn(item?: Item): string | undefined {
    return item ? item.name : undefined;
  }

  public closeClick(): void {
    this.dialogRef.close({
      status: 'updated',
      foodOrdersModified: this.foodOrdersModified,
      beverageOrdersModified: this.beverageOrdersModified
    });
  }

  public addOrder(orderType): void {
    this.orderService.createEmpty(orderType, this.table.number).subscribe(
      data => {
        this.table = data.table;
      },
      err => { console.error(err); },
      () => {
        console.log('order created', this.table);
        this.setOrderModified(orderType);
      }
    );
  }

  public deleteOrder(order: Order): void {
    this.orderService.delete(order._id, this.table.number).subscribe(
      data => {
        this.table = data.table;
      },
      err => { console.error(err); },
      () => {
        console.log('order deleted');
        this.setOrderModified(order.type);
      }
    );
  }

  public addItemHandler(item, order: Order) {
    this.addItemToOrder(item, order, this.newItemQuantity);
  }

  public addItemToOrder(item, order: Order, quantity) {
    this.itemService.addToOrder(item, order, quantity, this.table.number).subscribe(
      (result: any) => {
        this.table = result.table;
      },
      err => {
        console.error(err);
      },
      () => {
        this.foodAutocomplete.setValue('');
        this.beverageAutocomplete.setValue('');
        this.newItemQuantity = undefined;
        this.setOrderModified(order.type);
      }
    );
  }

  public removeItemFromOrder(item, order: Order) {
    this.itemService.removeFromOrder(item, order, this.table.number).subscribe(
      (result: any) => {
        this.table = result.table;
      },
      err => {
        console.error(err);
      },
      () => {
        console.log('Item removed');
        this.setOrderModified(order.type);
      }
    );
  }

  private setOrderModified(orderType) {
    if (orderType === 'food') {
      this.foodOrdersModified = true;
    } else {
      this.beverageOrdersModified = true;
    }
  }

}
