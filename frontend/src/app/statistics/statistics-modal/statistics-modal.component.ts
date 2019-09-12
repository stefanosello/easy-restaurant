import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CashdeskInfoModalComponent } from 'src/app/cashdesk/cashdesk-info-modal/cashdesk-info-modal.component';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-statistics-modal',
  templateUrl: './statistics-modal.component.html',
  styleUrls: ['./statistics-modal.component.scss']
})
export class StatisticsModalComponent implements OnInit {

  public userInfo: any;

  constructor(public dialogRef: MatDialogRef<CashdeskInfoModalComponent>,
              @Inject(MAT_DIALOG_DATA) public user: User,
              private userService: UserService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.get(this.user).subscribe(
      data => { console.log(data); },
      err => { console.error(err); },
      () => {}
    );
  }

}
