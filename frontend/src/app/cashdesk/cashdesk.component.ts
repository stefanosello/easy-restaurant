import { Component, OnInit } from '@angular/core';
import { Table } from '../_models/table';
import { TableService } from '../_services/table.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cashdesk',
  templateUrl: './cashdesk.component.html',
  styleUrls: ['./cashdesk.component.scss']
})
export class CashdeskComponent implements OnInit {

  tables: Table[]

  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.getTables();
  }

  getTables() {
    const tableObs: Observable<any> = this.tableService.getAll();
    tableObs.subscribe(data => {
      this.tables = data.tables;
      console.log(data);
    });
  }

  getWaiters(table: Table) {
    return table.services.map(service => service.waiter.username).join(", ");
  }

}
