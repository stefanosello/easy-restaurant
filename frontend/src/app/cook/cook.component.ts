import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { Observable } from 'rxjs';
import SocketHelper from '../_helpers/socket-helper';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { NoticeService } from '../_services/notice.service';

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
    private noticeService: NoticeService,
    private SnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getOrders();
    SocketHelper.registerEvent('orderAddedOrUpdated', () => {
      this.getNotice();
      this.getOrders();
    });
  }

  private getNotice() {
    this.noticeService.get(1).subscribe(
      (data: any) => {
        console.log(data);
        this.openSnackBar(`<strong>${data.notices[0].from.username}</strong>: ${data.notices[0].message}`);
      },
      err => console.error(err),
      () => { }
    )
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
