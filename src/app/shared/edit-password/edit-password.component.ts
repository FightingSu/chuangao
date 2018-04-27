import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import * as Actions from '../../store/cacheStore.actions';
import { SharedService } from '../../service/shared-service.service';

@Component({
  selector: 'eidt-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent implements OnInit {
  login: Observable<any>;
  userData: any = {};
  showOldPassword = false;
  showPassword = false;
  showConfirmPassword = false;
  view: number;

  constructor(
    private sharedService: SharedService,
    private store: Store<any>,
    private router: Router
  ) {
    this.login = store.select('login');
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res) {
        this.userData = res;
      }
    }).unsubscribe();
  }

  oldPasswordChanged() {
    let valid = true;
    if (!this.userData.oldPassword) {
      this.showOldPassword = true;
      valid = false;
    } else {
      this.showOldPassword = false;
    }
    return valid;
  }

  passwordChanged() {
    let valid = true;
    if (!this.userData.password) {
      this.showPassword = true;
      valid = false;
    } else {
      this.showPassword = false;
    }
    return valid;
  }

  confirmPasswordChanged() {
    let valid = true;
    if (!this.userData.confirmPassword) {
      this.showConfirmPassword = true;
      valid = false;
    } else {
      this.showConfirmPassword = false;
    }
    return valid;
  }

  checkForm() {
    let valid = true;
    valid = this.oldPasswordChanged();
    valid = this.passwordChanged();
    valid = this.confirmPasswordChanged();
    if (valid && this.userData.password !== this.userData.confirmPassword) {
      this.showConfirmPassword = true;
      valid = false;
    }
    return valid;
  }

  getParams() {
    const params = {
      'userId': this.userData.userId,
      'oldPwd': this.userData.oldPassword,
      'newPwd': this.userData.password
    };
    return params;
  }

  editPassword() {
    if (!this.checkForm()) {
      return;
    }
    const params = this.getParams();
    this.sharedService.post(`/updatePassword`, JSON.stringify(params), {
      httpOptions: true,
      successAlert: true,
      animation: true
    })
      .subscribe(res => {
          this.logout();
      });
  }

  logout(): void {
    this.store.dispatch(new Actions.SaveLogin(''));
    document.cookie = `login=`;
    this.router.navigate(['/login']);
  }

}
