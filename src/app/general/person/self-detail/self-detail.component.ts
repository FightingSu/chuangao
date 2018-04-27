import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { work_post, politicalStatus, positionalTitle } from '../../../store/translate';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SharedService } from '../../../service/shared-service.service';

@Component({
  selector: 'app-self-detail',
  templateUrl: './self-detail.component.html',
  styleUrls: ['./self-detail.component.scss']
})
export class SelfDetailComponent implements OnInit {
  data: any = {};
  educational = ['研究生', '本科', '专科', '中专', '高中'];
  work_post = work_post;
  now_date = new Date();
  politicalStatus = politicalStatus;
  positionalTitle = positionalTitle;
  login: Observable<any> = new Observable<any>();

  constructor(
    private store: Store<any>,
    private sharedService: SharedService
  ) {
    this.login = store.select('login');
  }

  age(val) {
    return this.now_date.getFullYear() - (new Date(val)).getFullYear() || 0;
  }

  getInfo(staffId) {
    this.sharedService.get(
      `/User/getUserDetail?userId=${staffId}`,
      {
        successAlert: false,
        animation: true
      }
    ).subscribe(
      res => this.data = res.data
    )
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res) {
        this.getInfo(res.userId);
      }
    }).unsubscribe();
  }
}
