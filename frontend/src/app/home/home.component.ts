import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Roles } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import SocketHelper from '../_helpers/socket-helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser = this.authService.getUserInfo();
  roles = Roles;
  noticeSnackbar: MatSnackBarRef<any>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private SnackBar: MatSnackBar
  ) { }

  openSnackBar() {
   this.noticeSnackbar = this.SnackBar.open('message', 'Dismiss');
  }

  ngOnInit() {
    SocketHelper.registerEvent('prova', () => {
      this.openSnackBar();
    });
  }

  public logOut() {
    this.authService.logout();
  }

}
