import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/_models/order';

@Component({
  selector: 'app-bartender-order-card',
  templateUrl: './bartender-order-card.component.html',
  styleUrls: ['./bartender-order-card.component.scss']
})
export class BartenderOrderCardComponent implements OnInit {

  @Input('order') order: Order;

  constructor() { }

  ngOnInit() {
  }

  serveOrder(){}
}
