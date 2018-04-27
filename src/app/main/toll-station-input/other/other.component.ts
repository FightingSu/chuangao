import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../../service/shared-service.service';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {
  login: Observable<any>;
  form: FormGroup;
  keys: Array<string>;
  data: any;
  requiredItems = {
    stationIntroduce: '收费站简介',
    stationHorstoryHonor: '收费站历史荣誉',
    stationEventHistory: '收费站大事件'
  };

  constructor(
    private store: Store<any>,
    private sharedService: SharedService
  ) {
    this.login = store.select('login');
    this.form = new FormGroup({
      stationIntroduce: new FormControl('', Validators.nullValidator),
      stationHorstoryHonor: new FormControl('', Validators.nullValidator),
      stationEventHistory: new FormControl('', Validators.nullValidator)
    });
    this.keys = Object.keys(this.form.value);
  }

  getInfo(orgCode) {
    this.sharedService.get(
      `/BaseInfo/getStationInfo?stationCode=${orgCode}`,
      {
        successAlert: false,
        animation: true
      }
    ).subscribe(
      res => {
        this.data = res.data;
        this.form.patchValue(res.data);
      }
    );
  }

  submit() {
    const spaceArr = this.keys.filter(el => !this.form.value[el]).map(el => this.requiredItems[el]);
    if (spaceArr.length > 0) {
      this.sharedService.addAlert('警告', `${spaceArr.join(',')}为空`);
    }else {
      this.keys.forEach(el => {
        this.data[el] = this.form.value[el];
      });
      this.sharedService.post(
        '/BaseInfo/setDefaultStation',
        JSON.stringify(this.data),
        {
          httpOptions: true,
          successAlert: true,
          animation: true
        }
      ).subscribe()
    }
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res && res.orgType === 3) {
        this.getInfo(res.orgCode);
      }
    }).unsubscribe();
    window.scrollTo(0, 0);
  }
}
