import { Component, OnInit, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { work_post } from '../../store/translate';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from '../../service/shared-service.service';

@Component({
  selector: 'app-toll-station',
  templateUrl: './toll-station.component.html',
  styleUrls: ['./toll-station.component.scss']
})
export class TollStationComponent implements OnInit, OnDestroy {
  data: any = {};
  login: Observable<any> = new Observable<any>();
  fullfilledSubscription: Subscription;
  workTrans = work_post;
  activedImg = 0;
  imgArrLength1: number;
  imgArrLength2: number;

  constructor(
    private sharedService: SharedService,
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.login = store.select('login');
  }

  getInfo(orgCode) {
    this.sharedService.get(`/BaseInfo/getStationInfo?stationCode=${orgCode}`, {
      animation: true
    })
            .subscribe(res => {
                this.data = res.data;
                this.imgArrLength1 = res.data.stationImg1.length;
                this.imgArrLength2 = res.data.stationImg2.length;(res.message);
            });
  }

  isActiveImg1(i) {
    if (this.imgArrLength1) {
      return this.activedImg % this.imgArrLength1 === i;
    }
  }

  isActiveImg2(i) {
    if (this.imgArrLength2) {
      return this.activedImg % this.imgArrLength2 === i;
    }
  }

  ngOnInit() {
    this.fullfilledSubscription = this.login.subscribe(res => {
      if (res && res.orgType === 3) {
        this.getInfo(res.orgCode);
      }else if (res && res.orgType !== 3 && /tollStation/.test(this.router.url)) {
        this.getInfo(this.route.snapshot.queryParams['orgCode']);
      }
    });
    setInterval(() => {
      this.activedImg++;
    }, 3000);
  }

  ngOnDestroy() {
    this.fullfilledSubscription.unsubscribe();
  }

}
