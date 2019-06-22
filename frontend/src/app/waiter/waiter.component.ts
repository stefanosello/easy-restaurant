import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TableService } from '../_services/table.service';
import { Table } from '../_models/table';
import { MatDialog } from '@angular/material';
import { WaiterStatusModalComponent } from './waiter-status-modal/waiter-status-modal.component';
import { WaiterOrderModalComponent } from './waiter-order-modal/waiter-order-modal.component';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.scss']
})
export class WaiterComponent implements OnInit {

  public tables: Table[];

  constructor(private tableService: TableService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getTables();
  }

  public getTables() {
    const tableObs: Observable<any> = this.tableService.getAll();
    tableObs.subscribe(data => {
      this.tables = data.tables;
      console.log(data);
    });
  }

  public openStatusModal(table): void {
    const dialogRef = this.dialog.open(WaiterStatusModalComponent, {
      data: table
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status && result.status === 'updated') {
        this.getTables();
      }
    });
  }

  public openOrderModal(table): void {
    const dialogRef = this.dialog.open(WaiterOrderModalComponent, {
      data: table
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
    });
  }

}
