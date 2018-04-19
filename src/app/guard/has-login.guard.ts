import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as Actions from '../store/cacheStore.actions';

@Injectable()
export class HasLoginGuard implements CanActivate {
  login: Observable<any>;
  hasLogin = false;
  orgType: number;
  isAdmin: number;

  constructor(
    private router: Router,
    private store: Store<any>
  ) {
    this.login = store.select('login');
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let loginInfo: any;
    const res = window.sessionStorage.getItem('login');
    if (res) {
      loginInfo = JSON.parse(res);
    }
    this.login.subscribe(res => {
      if (res && loginInfo) {
        this.orgType = res.orgType;
        this.isAdmin = res.isAdmin;
        this.hasLogin = true;
      }else {
        if (loginInfo) {
          this.store.dispatch(new Actions.SaveLogin(loginInfo));
          this.hasLogin = true;
        }else {
          this.hasLogin = false;
        }
      }
    });
    if (state.url !== '/login') {
      if (this.hasLogin) {
        return true;
      }else {
        this.router.navigate(['/login']);
        return false;
      }
    }else {
      if (this.hasLogin) {
        if ((this.orgType === 1 && this.isAdmin === 1) || (this.orgType === 2 && this.isAdmin === 1)) {
          this.router.navigate(['/admin']);
        }else if (this.orgType === 3 && this.isAdmin === 1) {
          this.router.navigate(['/main']);
        }else if (!this.isAdmin) {
          this.router.navigate(['/general']);
        }else if (this.isAdmin === 2) {
          this.router.navigate(['/super']);
        }
        return false;
      }else {
        return true;
      }
    }
  }
}
