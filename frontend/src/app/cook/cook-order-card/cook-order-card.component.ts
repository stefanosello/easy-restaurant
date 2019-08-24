import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemService } from 'src/app/_services/item.service';

@Component({
  selector: 'app-cook-order-card',
  templateUrl: './cook-order-card.component.html',
  styleUrls: ['./cook-order-card.component.scss']
})
export class CookOrderCardComponent implements OnInit {

  @Input('info') info: any;
  @Output() serve = new EventEmitter();

  constructor(private itemService: ItemService) { }

  ngOnInit() { }

  serveOrder() {
    this.serve.emit(this.info);
  }

  startItemPreparation(item, index) {
    this.itemService.startPreparation(item, this.info.order, this.info.tableNumber).subscribe(
      (data: any) => {
        this.info.order.items[index].start = data.start;
      },
      err => console.error(err),
      () => console.log('Preparation started')
    );
  }

  endItemPreparation(item, index) {
    this.itemService.endPreparation(item, this.info.order, this.info.tableNumber).subscribe(
      (data: any) => {
        this.info.order.items[index].end = data.end;
        if (this.checkAllItemsPrepared()) {
          this.serveOrder();
        }
      },
      err => console.error(err),
      () => console.log('Preparation finished')
    );
  }

  checkAllItemsPrepared() {
    return !this.info.order.items.find(element => !element.end);
  }

}
