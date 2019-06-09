import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Table } from 'src/app/_models/table';
import { activeService, foodOrders, beverageOrders, pendingBeverageOrders, pendingFoodOrders, processedFoodOrders, processedBeverageOrders } from '../../_helpers/table-helper';


@Component({
  selector: 'app-cashdesk-info-modal',
  templateUrl: './cashdesk-info-modal.component.html',
  styleUrls: ['./cashdesk-info-modal.component.scss']
})
export class CashdeskInfoModalComponent implements OnInit {

  public table: Table;
  public activeService = activeService;
  public foodOrders = foodOrders;
  public beverageOrders = beverageOrders;
  public processedFoodOrders = processedFoodOrders;
  public processedBeverageOrders = processedBeverageOrders;
  public pendingFoodOrders = pendingFoodOrders;
  public pendingBeverageOrders = pendingBeverageOrders;

  constructor(
    public dialogRef: MatDialogRef<CashdeskInfoModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Table) { }

  ngOnInit() {
    this.table = this.data;
    console.log(this.table);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public parseDate(date: string) {
    let d = new Date(date);
    let hours: string = d.getHours() / 10 >= 1 ? `${d.getHours()}` : `0${d.getHours()}`;
    let minutes: string = d.getMinutes() / 10 >= 1 ? `${d.getMinutes()}` : `0${d.getMinutes()}`;
    return `${hours}:${minutes}`
  }

}
