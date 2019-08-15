import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormControl, AsyncValidator, Validators } from '@angular/forms';
import { TableService } from 'src/app/_services/table.service';
import { ValidateTableNumberNotTaken } from '../../_validators/async-table-number-not-taken.validator'

@Component({
  selector: 'app-cashdesk-add-card-modal',
  templateUrl: './cashdesk-add-card-modal.component.html',
  styleUrls: ['./cashdesk-add-card-modal.component.scss']
})
export class CashdeskAddCardModalComponent implements OnInit {

  public tableNumber = new FormControl('', [Validators.required], ValidateTableNumberNotTaken.createValidator(this.tableService));
  public seatsNumber = new FormControl('', [Validators.required, Validators.min(1)]);


  constructor(public dialogRef: MatDialogRef<CashdeskAddCardModalComponent>, private tableService: TableService) { }

  ngOnInit() {
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  getNumberErrorMessage() {
    return this.tableNumber.hasError('required') ? 'You must enter a value' :
      this.tableNumber.hasError('tableNumberTaken') ? 'Table number already taken' :
        '';
  }

  getSeatsErrorMessage() {
    return this.tableNumber.hasError('required') ? 'You must enter a value' :
      this.tableNumber.hasError('min') ? 'Number of seats must be at least 1' :
        '';
  }

  public addTable() {
    const data: any = {
      tableNumber: this.tableNumber.value,
      numberOfSeats: this.seatsNumber.value
    };
    const component = this;
    this.tableService.addTable(data).subscribe(
      newData => { console.log('add table data: ', newData); },
      err => {
        console.error(err);
      },
      () => {
        component.dialogRef.close('done');
      }
    );
  }

}
