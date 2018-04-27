import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../../service/shared-service.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  login: Observable<any>;
  form: FormGroup;
  checkItem: string;
  keys: Array<string>;
  data: any;
  // trans = {
  //   companyCode: '公司编码',
  //   companyName: '公司名称',
  //   shortName: '简称',
  //   organizationCode: '组织机构代码',
  //   level: '公司级别',
  //   address: '地址',
  //   contacts: '联系人',
  //   phoneNo: '联系电话',
  //   briefIntro: '公司简介',
  //   status: '启用状态',
  //   totalMileage: '所辖路段里程（单位：公里）',
  //   longitude: '经度',
  //   latitude: '纬度'
  // };

  constructor(
    private store: Store<any>,
    private sharedService: SharedService
  ) {
    this.login = store.select('login');
    this.form = new FormGroup({
      masterName: new FormControl('', Validators.nullValidator),
      viceMaster1Name: new FormControl('', Validators.nullValidator),
      viceMaster2Name: new FormControl('', Validators.nullValidator),
      viceMaster3Name: new FormControl('', Validators.nullValidator),
      masterPhone: new FormControl('', Validators.nullValidator),
      viceMaster1Phone: new FormControl('', Validators.nullValidator),
      viceMaster2Phone: new FormControl('', Validators.nullValidator),
      viceMaster3Phone: new FormControl('', Validators.nullValidator),
      appraisalDepartment: new FormControl('', Validators.nullValidator),
      appraisalDepartmentPhone: new FormControl('', Validators.nullValidator),
      trafficPolice: new FormControl('', Validators.nullValidator),
      trafficPolicePhone: new FormControl('', Validators.nullValidator),
      trafficDepartment: new FormControl('', Validators.nullValidator),
      trafficDepartmentPhone: new FormControl('', Validators.nullValidator),
      localUrgent: new FormControl('', Validators.nullValidator),
      regionPlice: new FormControl('', Validators.nullValidator),
      bankName: new FormControl('', Validators.nullValidator),
      localUrgentPhone: new FormControl('', Validators.nullValidator),
      regionPolicePhone: new FormControl('', Validators.nullValidator),
      bankPhone: new FormControl('', Validators.nullValidator)
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
        this.checkItem = res.data.status;
      }
    )
  }

  submit() {
    this.form.value.status = +this.checkItem;
    // const spaceArr = this.keys.filter(el => !this.form.value[el]).map(el => this.trans[el]);
    // if (spaceArr.length > 0) {
    //   alert(`${spaceArr.join(',')}为空`);
    // }else {
    this.form.value.longitude = +this.form.value.longitude;
    this.form.value.latitude = +this.form.value.latitude;
    const keys = Object.keys(this.form.value);
    keys.forEach(el => {
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
    ).subscribe();
    // }
  }

  check($event) {
    this.checkItem = $event.target.value;
  }

  test(val) {
    return val === +this.checkItem;
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
