import { Component, OnInit } from '@angular/core';
import { Table } from '../_models/table';
import { TableService } from '../_services/table.service';

@Component({
  selector: 'app-cashdesk',
  templateUrl: './cashdesk.component.html',
  styleUrls: ['./cashdesk.component.scss']
})
export class CashdeskComponent implements OnInit {

  table: Table

  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.getTable(1);
  }

  getTable(number: number) {
    this.tableService.get(1).subscribe(data => this.table = data.table);
  }

}
