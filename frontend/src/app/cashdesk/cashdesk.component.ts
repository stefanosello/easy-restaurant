import { Component, OnInit, TemplateRef } from '@angular/core';
import { Table} from '../_models/table';
import { TableService } from '../_services/table.service';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { activeService, foodOrders, beverageOrders, pendingBeverageOrders, pendingFoodOrders, processedFoodOrders, processedBeverageOrders } from '../_helpers/table-helper';
import { CashdeskInfoModalComponent } from './cashdesk-info-modal/cashdesk-info-modal.component';
import { CashdeskBillModalComponent } from './cashdesk-bill-modal/cashdesk-bill-modal.component';


@Component({
  selector: 'app-cashdesk',
  templateUrl: './cashdesk.component.html',
  styleUrls: ['./cashdesk.component.scss']
})

export class CashdeskComponent implements OnInit {

  public tables: Table[];
  public modalTable: Table;
  public modalTableBill: any;
  public activeService = activeService;
  public foodOrders = foodOrders;
  public beverageOrders = beverageOrders;
  public processedFoodOrders = processedFoodOrders;
  public processedBeverageOrders = processedBeverageOrders;
  public pendingFoodOrders = pendingFoodOrders;
  public pendingBeverageOrders = pendingBeverageOrders;

  constructor(
    private tableService: TableService, 
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getTables();
  }

  public openInfoModal(table): void {
    const dialogRef = this.dialog.open(CashdeskInfoModalComponent, {
      data: table
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
    });
  }

  public openBillModal(table): void {
    const dialogRef = this.dialog.open(CashdeskBillModalComponent, {
      data: table
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "paid") {
        this.getTables();
      }
      console.log('The dialog was closed with result: ' + result);
    });
  }

  public getTables() {
    const tableObs: Observable<any> = this.tableService.getAll();
    tableObs.subscribe(data => {
      this.tables = data.tables;
      console.log(data);
    });
  }

}
