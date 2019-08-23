import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Order } from 'src/app/_models/order';

@Component({
  selector: 'app-bartender-order-card',
  templateUrl: './bartender-order-card.component.html',
  styleUrls: ['./bartender-order-card.component.scss']
})
export class BartenderOrderCardComponent implements OnInit {

  @Input('info') info: any;
  @Output() serve = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  serveOrder() {
    this.serve.emit(this.info);
  }
}
