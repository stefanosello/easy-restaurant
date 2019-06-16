import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { TableService } from 'src/app/_services/table.service';

@Component({
  selector: 'app-cashdesk-add-card-modal',
  templateUrl: './cashdesk-add-card-modal.component.html',
  styleUrls: ['./cashdesk-add-card-modal.component.scss']
})
export class CashdeskAddCardModalComponent implements OnInit {

  public idNumber: number;
  public seatsNumber: number;
  public errorMessage: string = null;

  constructor(public dialogRef: MatDialogRef<CashdeskAddCardModalComponent>, private tableService: TableService) { }

  ngOnInit() {
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public addTable() {
    const data: any = {
      tableNumber: this.idNumber,
      numberOfSeats: this.seatsNumber
    }
    const addTableObs: Observable<any> = this.tableService.addTable(data);
    let component = this;
    addTableObs.subscribe(
      data => { console.log(data) },
      err => {
        console.log("Error!!!!");
        console.error("error:", err);
        component.errorMessage = err.errormessage;
      },
      () => {
        component.dialogRef.close("done");
      }
    )
  }

}
