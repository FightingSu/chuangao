import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../../service/shared-service.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {
  login: Observable<any>;
  form: FormGroup;
  checkItem: string;
  keys: Array<string>;
  data: any;

  constructor(
    private store: Store<any>,
    private sharedService: SharedService
  ) {
    this.login = store.select('login');
    this.form = new FormGroup({
      enlaneDesignCount: new FormControl('', Validators.nullValidator),
      enlaneMtcCount: new FormControl('', Validators.nullValidator),
      enlaneBlendCount: new FormControl('', Validators.nullValidator),
      enlaneWeightCount: new FormControl('', Validators.nullValidator),
      enlaneFactCount: new FormControl('', Validators.nullValidator),
      enlaneEtcCount: new FormControl('', Validators.nullValidator),
      enlaneUlTraWideWidth: new FormControl('', Validators.nullValidator),
      enlaneAutoCount: new FormControl('', Validators.nullValidator),
      exlaneDesignCount: new FormControl('', Validators.nullValidator),
      exlaneMtcCount: new FormControl('', Validators.nullValidator),
      exlaneBlendCount: new FormControl('', Validators.nullValidator),
      exlaneWeightCount: new FormControl('', Validators.nullValidator),
      exlaneFactCount: new FormControl('', Validators.nullValidator),
      exlaneEtcCount: new FormControl('', Validators.nullValidator),
      exlaneUlTraWideWidth: new FormControl('', Validators.nullValidator),
      agriculTuralCheckCount: new FormControl('', Validators.nullValidator),
      laneMultipleCount: new FormControl('', Validators.nullValidator),
      laneVariableCount: new FormControl('', Validators.nullValidator),
      laneEmergencyCount: new FormControl('', Validators.nullValidator)
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
    // const spaceArr = this.keys.filter(el => !this.form.value[el]).map(el => this.trans[el]);
    // if (spaceArr.length > 0) {
    //   alert(`${spaceArr.join(',')}为空`);
    // }else {
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
