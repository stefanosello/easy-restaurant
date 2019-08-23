import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { Order } from '../_models/order';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.scss']
})
export class CookComponent implements OnInit {

  public cookId: string;
  public ordersRichInfo: any[];

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.getOrders();
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
