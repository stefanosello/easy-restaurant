import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TableService } from 'src/app/_services/table.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-waiter-status-modal',
  templateUrl: './waiter-status-modal.component.html',
  styleUrls: ['./waiter-status-modal.component.scss']
})
export class WaiterStatusModalComponent implements OnInit {

  public numberOfCovers = new FormControl('', [Validators.required, Validators.min(1)]);

  constructor(public dialogRef: MatDialogRef<WaiterStatusModalComponent>, private tableService: TableService) { }

  ngOnInit() {
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public getCoversErrorMessage() {
    return this.numberOfCovers.hasError('required') ? 'You must enter a value' :
      this.numberOfCovers.hasError('min') ? 'Number of seats must be at least 1' :
        '';
  }



}
