import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { work_post } from '../../store/translate';
import { SharedService } from '../../service/shared-service.service';

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss']
})
export class DivisionComponent implements OnInit {
  data: any = {};
  login: Observable<any>;
  workTrans = work_post;

  constructor(
    private store: Store<any>,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.login = store.select('login');
  }

  getInfo(orgCode) {
    this.sharedService
      .get(`/BaseInfo/getDivisionInfo?divisionCode=${orgCode}`,{successAlert:false,animation:true})
      .subscribe(
        res => this.data = res.data
      )
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res && res.orgType === 2) {
        this.getInfo(res.orgCode);
      }else if (res && res.orgType === 1 && /division/.test(this.router.url)) {
        this.getInfo(this.route.snapshot.queryParams['orgCode']);
      }
    }).unsubscribe();
    window.scrollTo(0, 0);
  }

}
