import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TableService } from '../_services/table.service';
import { Table } from '../_models/table';
import { MatDialog } from '@angular/material';
import { WaiterStatusModalComponent } from './waiter-status-modal/waiter-status-modal.component';
import { WaiterOrderModalComponent } from './waiter-order-modal/waiter-order-modal.component';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import SocketHelper from '../_helpers/socket-helper';
import { SocketioService } from '../_services/socketio.service';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.scss']
})
export class WaiterComponent implements OnInit {

  public tables: Table[];
  private noticeSnackbar: MatSnackBarRef<any>;

  // tslint:disable-next-line: max-line-length
  constructor(
    private tableService: TableService,
    public dialog: MatDialog,
    private SnackBar: MatSnackBar,
    private SocketService: SocketioService
  ) { }

  ngOnInit() {
    this.getTables();
    SocketHelper.registerEvent('orderProcessed', () => {
      this.openSnackBar('An order has just been processed');
      this.getTables();
    });
  }

  openSnackBar(message) {
    this.noticeSnackbar = this.SnackBar.open(message, 'Dismiss');
  }

  public getTables() {
    const tableObs: Observable<any> = this.tableService.getAll();
    tableObs.subscribe(data => {
      this.tables = data.tables;
    });
  }

  public openStatusModal(table): void {
    const dialogRef = this.dialog.open(WaiterStatusModalComponent, {
      data: table
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'updated') {
        this.getTables();
      }
    });
  }

  public openOrderModal(table): void {
    const dialogRef = this.dialog.open(WaiterOrderModalComponent, {
      data: table
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.foodOrdersModified) {
        SocketHelper.emitEvent(this.SocketService, 'orderAddedOrUpdated', null, 'cooks');
      }
      if (result.beverageOrdersModified) {
        SocketHelper.emitEvent(this.SocketService, 'orderAddedOrUpdated', null, 'bartenders');
      }
      if (result && result.status === 'updated') {
        this.getTables();
      }
    });
  }

}
