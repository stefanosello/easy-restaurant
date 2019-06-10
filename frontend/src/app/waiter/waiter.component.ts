import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TableService } from '../_services/table.service';
import { Table } from '../_models/table';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.scss']
})
export class WaiterComponent implements OnInit {

  private tables: Table[];

  constructor( private tableService: TableService) { }

  ngOnInit() {
    this.getTables();
  }

  public getTables() {
    const tableObs: Observable<any> = this.tableService.getAll();
    tableObs.subscribe(data => {
      this.tables = data.tables;
      console.log(data);
    });
  }

}
