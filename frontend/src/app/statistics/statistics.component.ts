import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { MatDialog } from '@angular/material/dialog';
import { StatisticsModalComponent } from './statistics-modal/statistics-modal.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  public users: User[] = [];

  constructor(private userService: UserService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers() {
    this.userService.getAll().subscribe(
      data => {
        console.log(data);
        this.users = data.users;
      },
      err => {
        console.error(err);
      },
      () => {}
    );
  }

  public deleteUser(user) {
    this.userService.delete(user).subscribe(
      _ => {
        this.users = this.users.filter(u => u.username != user.username);
      },
      err => {
        console.error(err);
      },
      () => {}
    );
  }

  public openStatisticsModal(user): void {
    const dialogRef = this.dialog.open(StatisticsModalComponent, {
      data: user
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ' + result);
    });
  }

}
