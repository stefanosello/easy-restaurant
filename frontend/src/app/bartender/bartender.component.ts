import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { Observable } from 'rxjs';
import SocketHelper from '../_helpers/socket-helper';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { NoticeService } from '../_services/notice.service';

@Component({
  selector: 'app-bartender',
  templateUrl: './bartender.component.html',
  styleUrls: ['./bartender.component.scss']
})
export class BartenderComponent implements OnInit {

  public bartenderId: string;
  public ordersRichInfo: any[];
  private noticeSnackbar: MatSnackBarRef<any>;

  constructor(
    private orderService: OrderService,
    private SnackBar: MatSnackBar,
    private noticeService: NoticeService,
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
    this.noticeSnackbar = this.SnackBar.open(message, 'Dismiss', {
      duration: 3000
    });
  }

  getOrders() {
    const orderObs: Observable<any> = this.orderService.getAll({ type: 'beverage', processed: false, populate: true });
    orderObs.subscribe(data => {
      this.ordersRichInfo = data.richInfo;
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
