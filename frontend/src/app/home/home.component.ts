import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Roles } from '../_models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser = this.authService.getUserInfo();
  roles = Roles;

  constructor(private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

}
