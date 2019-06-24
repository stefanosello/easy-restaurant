import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { Order } from '../_models/order';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bartender',
  templateUrl: './bartender.component.html',
  styleUrls: ['./bartender.component.scss']
})
export class BartenderComponent implements OnInit {

  bartenderId: string;
  orders: Object[];

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    const orderObs: Observable<any> = this.orderService.getAll({ type: 'beverage', processed: false, populate: true });
    orderObs.subscribe(data => {
      this.orders = data.orders;
      console.log(data);
    });
  }

}
