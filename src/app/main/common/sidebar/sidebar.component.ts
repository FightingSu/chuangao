import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as Actions from '../../../store/cacheStore.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  login: Observable<any>;
  orgType: number;
  orgTypeStr: string;
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
    return /(roadCompany|division|tollStation|staffDetail)/.test(this.router.url);
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res) {
        this.orgType = res.orgType;
      }
    }).unsubscribe();
  }

}
