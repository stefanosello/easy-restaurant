import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (localStorage.getItem('token')) {
      const currentUser = this.authService.getUserInfo();
      if (currentUser) {
        // check if route is restricted by role
        if (next.data.roles && next.data.roles.indexOf(currentUser.role) === -1) {
          // role not authorised so redirect to home page
          this.router.navigate(['/' + currentUser.role.replace('_', '')]);
          return false;
        }

        // authorised so return true
        return true;
      }
    }

    // not logged so return false
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
