import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as Actions from '../../store/cacheStore.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-sidebar',
  templateUrl: './general-sidebar.component.html',
  styleUrls: ['./general-sidebar.component.scss']
})
export class GeneralSidebarComponent implements OnInit {
  login: Observable<any>;
  orgType: number;
  orgTypeStr: string;
  orgLink: string;
  orgInputLink: string;
  orgLevel = ['路公司', '管理处'];
  orgLinks = ['roadCompany', 'division'];
  orgInputLinks = ['roadCompanyInput', 'divisionInput'];
  userId: string;

  constructor(
    private store: Store<any>,
    private router: Router
  ) {
    this.login = store.select('login');
  }

  testHash(str): boolean {
    return (new RegExp(str)).test(this.router.url);
  }

  isBasic(): boolean {
    return /(roadCompany|division)/.test(this.router.url);
  }

  ngOnInit() {
    this.login.subscribe(res => {
      this.orgType = res.orgType;
      if (res) {
        this.orgTypeStr = this.orgLevel[res.orgType - 1];
        this.orgLink = this.orgLinks[res.orgType - 1];
        this.orgInputLink = this.orgInputLinks[res.orgType - 1];
      }
    }).unsubscribe();
  }

}
