import { Component, OnInit } from '@angular/core';
import { Table } from '../_models/table';
import { TableService } from '../_services/table.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CashdeskInfoModalComponent } from './cashdesk-info-modal/cashdesk-info-modal.component';
import { CashdeskBillModalComponent } from './cashdesk-bill-modal/cashdesk-bill-modal.component';
import { CashdeskAddCardModalComponent } from './cashdesk-add-card-modal/cashdesk-add-card-modal.component';


@Component({
  selector: 'app-cashdesk',
  templateUrl: './cashdesk.component.html',
  styleUrls: ['./cashdesk.component.scss']
})

export class CashdeskComponent implements OnInit {

  public tables: Table[];
  public modalTable: Table;
  public modalTableBill: any;

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

  public openAddCardModal(): void {
    const dialogRef = this.dialog.open(CashdeskAddCardModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === "done") {
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
