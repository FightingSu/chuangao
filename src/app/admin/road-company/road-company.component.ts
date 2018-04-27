import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { work_post } from '../../store/translate';
import { SharedService } from "../../service/shared-service.service";

@Component({
  selector: 'app-road-company',
  templateUrl: './road-company.component.html',
  styleUrls: ['./road-company.component.scss']
})
export class RoadCompanyComponent implements OnInit {
  data: any = {};
  login: Observable<any>;
  workTrans = work_post;

  constructor(
    private store: Store<any>,
    private sharedService: SharedService
  ) {
    this.login = store.select('login');
  }

  getInfo(orgCode) {
    this.sharedService.get(
      `/BaseInfo/getCompanyInfo?companyCode=${orgCode}`,
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
      if (res && res.orgType === 1) {
        this.getInfo(res.orgCode);
      }
    }).unsubscribe();
    window.scrollTo(0, 0);
  }

}
