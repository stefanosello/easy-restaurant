import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cook-order-card',
  templateUrl: './cook-order-card.component.html',
  styleUrls: ['./cook-order-card.component.scss']
})
export class CookOrderCardComponent implements OnInit {

  @Input('info') info: any;
  @Output() serve = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  serveOrder() {
    this.serve.emit(this.info);
  }

}
