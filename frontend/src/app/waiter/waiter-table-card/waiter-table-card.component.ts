import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Table } from 'src/app/_models/table';
import { activeService, foodOrders, beverageOrders, pendingBeverageOrders, pendingFoodOrders, processedFoodOrders, processedBeverageOrders } from '../../_helpers/table-helper';

@Component({
  selector: 'app-waiter-table-card',
  templateUrl: './waiter-table-card.component.html',
  styleUrls: ['./waiter-table-card.component.scss']
})
export class WaiterTableCardComponent implements OnInit {

  @Input('table') table: Table;
  public activeService = activeService;
  public foodOrders = foodOrders;
  public beverageOrders = beverageOrders;
  public processedFoodOrders = processedFoodOrders;
  public processedBeverageOrders = processedBeverageOrders;
  public pendingFoodOrders = pendingFoodOrders;
  public pendingBeverageOrders = pendingBeverageOrders;

  constructor() { }

  ngOnInit() {
  }

}
