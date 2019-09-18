import { Component, OnInit, Inject } from '@angular/core';
import { User } from 'src/app/_models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'src/app/_services/user.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.scss']
})
export class UserInfoModalComponent implements OnInit {

  user: User;

  public firstName = new FormControl('', [Validators.required]);
  public lastName = new FormControl('', [Validators.required]);
  public role = new FormControl('', [Validators.required]);
  public username = new FormControl({ value: '', disabled: true }, [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<UserInfoModalComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) { }

  ngOnInit() {
    this.getUser()
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  getUser() {
    this.userService.get(this.data).subscribe(
      data => {
        this.user = Object.assign(new User(), data.user);
        if (this.user.name) {
          this.firstName.setValue(this.user.name.first || '');
          this.lastName.setValue(this.user.name.last || '');
        }
        this.username.setValue(this.user.username);
        this.role.setValue(this.user.role);
      }
    )
  }

  updateUser() {
    const data: any = {
      name: {
        first: this.firstName.value,
        last: this.lastName.value
      },
      role: this.role.value,
      username: this.data.username,
    };
    const component = this;
    this.userService.update(data).subscribe(
      newData => { console.log('edit user data: ', newData); },
      err => console.error(err),
      () => {
        component.dialogRef.close('done');
      }
    );
  }

}
