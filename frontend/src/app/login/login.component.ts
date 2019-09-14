import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  submitted: boolean = false;
  invalid: boolean = false;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }

  onSubmit() {
    const fields = this.form.value;
    this.submitted = true;

    if (fields.username && fields.password) {
      this.authService.login(fields.username, fields.password)
        .pipe(first())
        .subscribe(
          data => this.router.navigate([this.returnUrl]),
          error => this.invalid = true
        )
    }
  }

}
