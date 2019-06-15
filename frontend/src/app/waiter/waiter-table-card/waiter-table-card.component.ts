import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Table } from 'src/app/_models/table';
import { activeService, foodOrders, beverageOrders, pendingBeverageOrders, pendingFoodOrders, processedFoodOrders, processedBeverageOrders } from '../../_helpers/table-helper';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-waiter-table-card',
  templateUrl: './waiter-table-card.component.html',
  styleUrls: ['./waiter-table-card.component.scss']
})
export class WaiterTableCardComponent implements OnInit {

  @Input('table') table: Table;
  @Output() openStatusModal = new EventEmitter<Table>();
  @Output() openOrderModal = new EventEmitter<Table>();
  public activeService = activeService;
  public foodOrders = foodOrders;
  public beverageOrders = beverageOrders;
  public processedFoodOrders = processedFoodOrders;
  public processedBeverageOrders = processedBeverageOrders;
  public pendingFoodOrders = pendingFoodOrders;
  public pendingBeverageOrders = pendingBeverageOrders;
  public user: User;

  constructor(private AuthService: AuthService) { }

  ngOnInit() {
    this.user = this.AuthService.getUserInfo();
  }

  public openStatusHandler() {
    this.openStatusModal.emit(this.table);
  }

  public openOrderHandler() {
    this.openOrderModal.emit(this.table);
  }

}
