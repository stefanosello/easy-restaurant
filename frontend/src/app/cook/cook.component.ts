import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { Order } from '../_models/order';
import { Observable } from 'rxjs';
import SocketHelper from '../_helpers/socket-helper';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.scss']
})
export class CookComponent implements OnInit {

  public cookId: string;
  public ordersRichInfo: any[];
  private noticeSnackbar: MatSnackBarRef<any>;

  constructor(
    private orderService: OrderService,
    private SnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getOrders();
    SocketHelper.registerEvent('orderAddedOrUpdated', () => {
      this.openSnackBar('Some orders have been added or updated');
      this.getOrders();
    });
  }

  openSnackBar(message) {
    this.noticeSnackbar = this.SnackBar.open(message, 'Dismiss');
  }

  getOrders() {
    const orderObs: Observable<any> = this.orderService.getAll({ type: 'food', processed: false, populate: true });
    orderObs.subscribe(data => {
      this.ordersRichInfo = data.richInfo.sort((el1, el2) => {
        const time1 = new Date(el1.order.created_at);
        const time2 = new Date(el2.order.created_at);
        return time1.getTime() - time2.getTime();
      });
      console.log(data);
    });
  }

  serveOrder(info) {
    this.orderService.process(info.tableNumber, info.order._id).subscribe(
      data => console.log(data),
      err => console.error(err),
      () => {
        this.getOrders();
      }
    );
  }

}
