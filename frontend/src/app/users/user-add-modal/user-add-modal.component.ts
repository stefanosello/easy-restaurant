import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-user-add-modal',
  templateUrl: './user-add-modal.component.html',
  styleUrls: ['./user-add-modal.component.scss']
})
export class UserAddModalComponent implements OnInit {

  hide = true

  public firstName = new FormControl('', [Validators.required]);
  public lastName = new FormControl('', [Validators.required]);
  public role = new FormControl('', [Validators.required]);
  public username = new FormControl('', [Validators.required]);
  public password = new FormControl('', [Validators.required]);


  constructor(
    public dialogRef: MatDialogRef<UserAddModalComponent>,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public createUser() {
    const data: any = {
      name: {
        first: this.firstName.value,
        last: this.lastName.value
      },
      role: this.role.value,
      username: this.username.value,
      password: this.username.value
    };
    const component = this;
    this.userService.create(data).subscribe(
      newData => { console.log('add user data: ', newData); },
      err => console.error(err),
      () => {
        component.dialogRef.close('done');
      }
    );
  }

}
