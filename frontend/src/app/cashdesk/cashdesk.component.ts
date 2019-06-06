import { Component, OnInit, TemplateRef } from '@angular/core';
import { Table } from '../_models/table';
import { TableService } from '../_services/table.service';
import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { jsonSyntaxHighlight } from '../_helpers/utils'

@Component({
  selector: 'app-cashdesk',
  templateUrl: './cashdesk.component.html',
  styleUrls: ['./cashdesk.component.scss']
})
export class CashdeskComponent implements OnInit {

  public tables: Table[];
  public modalRef: BsModalRef;
  public infoModalTable: Table;

  constructor(private tableService: TableService, private modalService: BsModalService) { }

  ngOnInit() {
    this.getTables();
  }

  public openModal(template: TemplateRef<any>, table: Table) {
    this.infoModalTable = table;
    this.modalRef = this.modalService.show(template);
  }

  public getTables() {
    const tableObs: Observable<any> = this.tableService.getAll();
    tableObs.subscribe(data => {
      this.tables = data.tables;
      console.log(data);
    });
  }

  public getWaiters(table: Table) {
    return table.services.map(service => service.waiter.username).join(", ");
  }

  public getGeneralInfo(table: Table) {
    return jsonSyntaxHighlight(table);
  }

}
