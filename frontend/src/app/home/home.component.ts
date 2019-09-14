import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Roles } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import SocketHelper from '../_helpers/socket-helper';
import NoticeHelper from '../_helpers/notice-helper';
import { NoticeService } from '../_services/notice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser = this.authService.getUserInfo();
  roles = Roles;
  public NoticeHelper = NoticeHelper;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,
    private noticeService: NoticeService
  ) { }

  ngOnInit() {
    NoticeHelper.initNotices(this.noticeService);
    SocketHelper.setSocketInstance(this.authService.getUserInfo().token);
  }

  public logOut() {
    this.authService.logout().subscribe(
      ok => this.router.navigate(['/login']),
      error => alert('An error has occured during logout')
    );
  }

}
