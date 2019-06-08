import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Table, Service } from 'src/app/_models/table';
import { activeService, foodOrders, beverageOrders, pendingBeverageOrders, pendingFoodOrders, processedFoodOrders, processedBeverageOrders } from '../../_helpers/table-helper';

@Component({
  selector: 'app-cashdesk-table-card',
  templateUrl: './cashdesk-table-card.component.html',
  styleUrls: ['./cashdesk-table-card.component.scss']
})
export class CashdeskTableCardComponent implements OnInit {

  @Input('table') table: Table;
  @Output() openInfoModal = new EventEmitter<Table>();
  @Output() openBillModal = new EventEmitter<Table>();
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

  public openInfoHandler() {
    this.openInfoModal.emit(this.table);
  }

  public openBillHandler() {
    this.openBillModal.emit(this.table);
  }

}
