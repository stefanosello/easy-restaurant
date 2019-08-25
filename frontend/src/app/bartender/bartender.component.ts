import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { Observable } from 'rxjs';
import SocketHelper from '../_helpers/socket-helper';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

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
