import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Store, _FEATURE_REDUCERS } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from "../../../service/shared-service.service";

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {
  login: Observable<any>;
  form: FormGroup;
  checkItem: string;
  keys: Array<string>;
  requiredItems = {
    companyCode: '公司编码',
    companyName: '公司名称',
    shortName: '简称',
    organizationCode: '组织机构代码',
    level: '公司级别',
    address: '地址',
    contacts: '联系人',
    phoneNo: '联系电话',
    briefIntro: '公司简介',
    // status: '启用状态',
    totalMileage: '所辖路段里程（单位：公里）',
    longitude: '经度',
    latitude: '纬度'
  };

  constructor(
    private store: Store<any>,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.login = store.select('login');
    this.form = new FormGroup({
      companyCode: new FormControl('', Validators.nullValidator),
      companyName: new FormControl('', Validators.nullValidator),
      organizationCode: new FormControl('', Validators.nullValidator),
      shortName: new FormControl('', Validators.nullValidator),
      level: new FormControl('', Validators.nullValidator),
      address: new FormControl('', Validators.nullValidator),
      contacts: new FormControl('', Validators.nullValidator),
      phoneNo: new FormControl('', Validators.nullValidator),
      briefIntro: new FormControl('', Validators.nullValidator),
      // status: new FormControl('', Validators.nullValidator),
      totalMileage: new FormControl('', Validators.nullValidator),
      longitude: new FormControl('', Validators.nullValidator),
      latitude: new FormControl('', Validators.nullValidator)
    });
    this.keys = Object.keys(this.form.value);
  }

  getInfo(orgCode) {
    this.sharedService.get(
      `/BaseInfo/getCompanyInfo?companyCode=${orgCode}`,
      {
        successAlert: false,
        animation: true
      }
    ).subscribe(res => {
      this.form.patchValue(res.data);
    })
  }

  submit() {
    const spaceArr = this.keys.filter(el => !this.form.value[el] && this.form.value[el] !== 0).map(el => this.requiredItems[el]);
    if (spaceArr.length > 0) {
      this.sharedService.addAlert('警告',`${spaceArr.join(',')}为空`);
    }else {
      this.form.value.status = this.checkItem;
      this.form.value.totalMileage = +this.form.value.totalMileage;
      this.form.value.longitude = +this.form.value.longitude;
      this.form.value.latitude = +this.form.value.latitude;
      this.sharedService.post(
        '/BaseInfo/setDefaultCompany',
        JSON.stringify(this.form.value),
        {
          httpOptions: true,
          successAlert: true,
          animation: true
        }
      ).subscribe();
    }
  }

  check($event) {
    this.checkItem = $event.target.value;
  }

  test(val) {
    return val === +this.checkItem;
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
