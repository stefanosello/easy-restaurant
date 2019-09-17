import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { MatDialog } from '@angular/material';
import { UserInfoModalComponent } from './user-info-modal/user-info-modal.component';
import { UserAddModalComponent } from './user-add-modal/user-add-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[]

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getAll().subscribe(
      data => this.users = data.users.map(user => Object.assign(new User(), user))
    )
  }

  cashdesks = () => this.users.filter(user => user.role == 'cash_desk')
  waiters = () => this.users.filter(user => user.role == 'waiter')
  cooks = () => this.users.filter(user => user.role == 'cook')
  bartenders = () => this.users.filter(user => user.role == 'bartender')

  public openInfoModal(table): void {
    const dialogRef = this.dialog.open(UserInfoModalComponent, {
      data: table
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
    });
  }

  public openAddModal(): void {
    const dialogRef = this.dialog.open(UserAddModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === "done") {
        this.getUsers();
      }
      console.log('The dialog was closed with result: ' + result);
    });
  }

}
