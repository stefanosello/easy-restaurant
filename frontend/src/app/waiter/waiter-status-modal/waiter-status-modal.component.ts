import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TableService } from 'src/app/_services/table.service';
import { FormControl, Validators } from '@angular/forms';
import { Table, Service } from 'src/app/_models/table';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-waiter-status-modal',
  templateUrl: './waiter-status-modal.component.html',
  styleUrls: ['./waiter-status-modal.component.scss']
})
export class WaiterStatusModalComponent implements OnInit {

  public numberOfCovers = new FormControl('', [Validators.required, Validators.min(1)]);
  public table: Table;

  constructor(
    public dialogRef: MatDialogRef<WaiterStatusModalComponent>,
    private tableService: TableService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: Table
  ) { }

  ngOnInit() {
    this.table = this.data;
    console.log(this.table);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public getCoversErrorMessage(): string {
    return this.numberOfCovers.hasError('required') ? 'You must enter a value' :
      this.numberOfCovers.hasError('min') ? 'Number of seats must be at least 1' :
        '';
  }

  public markAsBusy() {
    const covers: number = this.numberOfCovers.value;
    const newService: Service = new Service();
    newService.covers = covers;
    newService.waiter = this.authService.getUserInfo()._id;
    console.log(this.authService.getUserInfo()._id);
    newService.done = false;
    newService.orders = [];
    this.table.services.push(newService);
    this.table.busy = true;
    this.tableService.updateTable(this.table).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.error(err);
      },
      () => {
        this.dialogRef.close({ status: 'updated', tableNumber: this.table.number });
      }
    );
  }

}
