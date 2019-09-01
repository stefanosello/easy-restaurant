import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (localStorage.getItem('token')) {
      const currentUser = this.authService.getUserInfo();
      if (currentUser && currentUser.role) {
        if (!next.queryParams.authorized) {
          this.router.navigate(['/' + currentUser.role.replace('_', '')], { queryParams: { authorized: true } });
          return true;
        } else {
          return true;
        }
      }
    }

    // not logged so return false
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
