import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FormArray } from '@angular/forms/src/model';
import { identifierName } from '@angular/compiler';
import { SharedService } from '../../../service/shared-service.service';

@Component({
  selector: 'app-train-execute',
  templateUrl: './train-execute.component.html',
  styleUrls: ['./train-execute.component.scss']
})
export class TrainExecuteComponent implements OnInit {
  data: any = {};
  form: FormGroup;
  trainForm: FormGroup;
  searchForm: FormGroup;
  orgCode: string;
  doStartDate: string;
  doEndDate: string;
  startDate: string;
  endDate: string;
  en: any;
  file: any;
  filename: string;
  isChosen = false;
  orgType: number;
  login: Observable<any> = new Observable<any>();
  page = 0;
  size = 15;
  count: number;
  doFilePath: string;
  planFilePath: string;
  staffList: Array<any>;
  hasData: boolean;
  updateUrl = `http://119.29.144.125:8080/cgfeesys/User/setUserDetail`;
  cols: Array<any>;
  userList: Array<any>;
  selectedUser = '';
  isAdd: boolean;
  keys: Array<any>;
  selectionStaffMode = 'checkbox';
  selectionMode = 'single';
  searchOrg: Array<any>;
  initForm: any;
  orgName: string;
  _trainTimeLong = 0.5;
  param: any = {
    page: this.page,
    size: this.size
  };
  isShow = false;
  teams = 0;
  activedStaffList: Array<any> = [];
  joinStaffList: Array<any> = [];
  doId: string;
  constructor(
    private store: Store<any>,
    private sharedService: SharedService
  ) {
    this.form = new FormGroup({
      trainName: new FormControl('', Validators.nullValidator),
      trainOrgName: new FormControl('', Validators.nullValidator),
      trainDoOrg: new FormControl('', Validators.nullValidator),
      trainStartDate: new FormControl('', Validators.nullValidator),
      trainTeacher: new FormControl('', Validators.nullValidator),
      trainEndDate: new FormControl('', Validators.nullValidator),
      trainUnit: new FormControl('', Validators.nullValidator),
      trainTimeLong: new FormControl('', Validators.nullValidator),
      trainType: new FormControl('', Validators.nullValidator),
      trainWay: new FormControl('', Validators.nullValidator),
      trainContent: new FormControl('', Validators.nullValidator),
      trainLoc: new FormControl('', Validators.nullValidator)
    });
    this.trainForm = new FormGroup({
      trainPlanName: new FormControl('', Validators.nullValidator),
      trainAddress: new FormControl('', Validators.nullValidator),
      trainDoStartDate: new FormControl('', Validators.nullValidator),
      trainDoEndDate: new FormControl('', Validators.nullValidator),
      trainTeacher: new FormControl('', Validators.nullValidator),
      // trainDoTimeLong: new FormControl('', Validators.nullValidator),
      // trainDoTimeNumber: new FormControl('', Validators.nullValidator),
      trainContent: new FormControl('', Validators.nullValidator),
      userIdList: new FormControl('', Validators.nullValidator)
    });
    this.searchForm = new FormGroup({
      hasDo: new FormControl('', Validators.nullValidator),
      // trainWay: new FormControl('', Validators.nullValidator),
      // trainType: new FormControl('', Validators.nullValidator),
      // trainPlanName: new FormControl('', Validators.nullValidator),
      // trainStartDate: new FormControl('', Validators.nullValidator),
      // trainEndDate: new FormControl('', Validators.nullValidator)
    });
    this.doFilePath = '';
    this.planFilePath = '';
    this.orgCode = '';
    this.keys = Object.keys(this.form.value);
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    this.login = store.select('login');
    this.cols = [
      { field: 'trainPlanName', header: '培训计划名称' },
      { field: 'trainPlanOrgName', header: '发起单位' },
      { field: 'trainDoOrgName', header: '落实单位' },
      { field: 'hasDo', header: '落实状态' },
      { field: 'trainPlanStartDate', header: '开始时间' },
      { field: 'trainPlanEndDate', header: '结束时间' },
      { field: 'trainWay', header: '培训方式' },
      { field: 'trainType', header: '培训类别' },
      { field: 'trainPlanTeacher', header: '培训讲师' },
      { field: 'trainPlanTimeLong', header: '培训课时' },
      { field: 'trainPlanLoc', header: '培训地点' },
      // { field: 'trainDoTeacher', header: '落实培训讲师' },
      // { field: 'trainDoTimeLong', header: '落实培训课时' },
      // { field: 'trainDoAddress', header: '落实培训地点' },
      // { field: 'trainDoStartDate', header: '落实起始时间' },
      // { field: 'trainDoEndDate', header: '落实结束时间' }
    ];
    this.initForm = {
      trainPlanName: '',
      trainPlanOrg: '',
      trainStartDate: '',
      trainTeacher: '',
      trainEndDate: '',
      trainUnit: '',
      trainTimeLong: '',
      trainType: '',
      trainWay: '',
      trainContent: '',
      trainLoc: ''
    };
  }

  // trainTimerChanged($event){
  //   $event.target.value = this.trainForm.value.trainDoTimeNumber * 0.5;
  //   this.trainForm.value.trainDoTimeLong = $event.target.value;
  // }

  get trainTimeLong() {
    return this._trainTimeLong;
  }

  set trainTimeLong(val) {
    val = Math.round(val * 2) / 2;
    this._trainTimeLong = val < 0.5 ? 0.5 : val;
  }

  selectedOrg($event) {
    this.searchOrg[0] = ($event);
  }
  selectedStaff($event) {
    this.userList = ($event);
  }
  getStaffInfo(planId) {
    this.isChosen = true;
    this.sharedService.get(`/Train/planGetById?id=${planId}`, {
        animation: true
      })
      .subscribe(res => {
          this.data = res.data;
          this.form.patchValue(res.data.trainPlanData);
          this.planFilePath = res.data.trainPlanData.trainPlanFile;
          this.endDate = res.data.trainPlanData.trainEndDate;
          this.startDate = res.data.trainPlanData.trainStartDate;
          this.trainForm.patchValue({trainPlanName: res.data.trainPlanData.trainName});
          this.doId = res.data.trainDoListDataList.filter(el => el.trainDoOrgCode === this.orgCode)[0].doId;
      });
  }
  getInfo() {
    if (+this.searchForm.value.hasDo === 1) {
      this.param.hasDo = false;
    }else if (+this.searchForm.value.hasDo === 2) {
      this.param.hasDo = true;
    }else {
      delete this.param.hasDo;
    }
    this.sharedService.post('/Train/doGet', JSON.stringify(this.param) , {
              httpOptions: true
            })
            .subscribe(res => {
                this.count = res.data.count;
                if (res.data.count > 0) {
                  this.hasData = true;
                }
                res.data.trainDoDataList.forEach(item => {
                  item.hasDo = item.trainTimeLong === 0 ? '已落实' : '未落实';
                });
                this.staffList = res.data.trainDoDataList;
            });
  }

  fileChange($event) {
    this.filename = $event.target.files[0].name;
    this.file = $event.target.files[0];
  }
  dateFormat(date) {
    if (date) {
      const _date = new Date(date);
      const _month = (_date.getMonth() + 1) <= 9 ? `0${(_date.getMonth() + 1)}` : _date.getMonth();
      const _day = _date.getDate() <= 9 ? `0${_date.getDate()}` : _date.getDate();
      return `${_date.getFullYear()}-${_month}-${_day}`;
    } else {
      return '';
    }
  }

  add() {
    this.form.reset();
    this.form.patchValue(this.initForm);
    this.filename = '';
    this.isChosen = true;
    this.isAdd = true;
  }

  search() {
    this.getInfo();
    this.toFirstPage();
  }

  // update() {
  //   if (this.selectedUser) {
  //     this.getStaffInfo(this.selectedUser);
  //     this.isChosen = true;
  //     this.isAdd = false;
  //   } else {
  //     alert('请选择一个人员');
  //   }
  // }

  // delete() {
  //   if (this.selectedUser) {
  //     this.staffLeave(this.selectedUser);
  //   } else {
  //     alert('请选择一个人员');
  //   }
  // }

  select(val) {
    this.selectedUser = val === this.selectedUser ? '' : val;
  }

  check(val) {
    return val === this.selectedUser;
  }

  // staffLeave(selectedUser) {
  //   const leaveDate = this.dateFormat(new Date());
  //   this.http.get(`http://119.29.144.125:8080/cgfeesys/StaffMag/staffLeave?userId=${selectedUser}&leaveDate=${leaveDate}`)
  //           .map(res => res.json())
  //           .subscribe(res => {
  //             alert(res.message);
  //             if (res.code) {
  //               this.toFirstPage();
  //             }
  //           });
  // }

  addStaff() {
    this.trainForm.value.trainTimeLong = this.trainTimeLong;
    // this.trainForm.value.trainDoTimeLong = this.trainForm.value.trainDoTimeNumber * 0.5;
    this.trainForm.value.trainDoStartDate = this.dateFormat(this.doStartDate);
    this.trainForm.value.trainDoEndDate = this.dateFormat(this.doEndDate);
    this.trainForm.value.userIdList = this.activedStaffList.map(el => el.userId);
    const tmpObj: any = {};
    const keys = Object.keys(this.trainForm.value);
    keys.forEach(el => {
      if (el !== 'trainPlanName' && el !== 'trainDoOrgName') {
        tmpObj[el] = this.trainForm.value[el];
      }
    });
    tmpObj.id = this.doId;
    this.sharedService.post(`/Train/doAdd`, JSON.stringify(tmpObj), {
              httpOptions: true
            })
            .subscribe(res => {
                if (this.file) {
                  this.upload(res.data.id);
                } else {
                  this.sharedService.addAlert('通知', res.message);
                  this.toFirstPage();
                }
            });
  }

  paginate($event) {
    this.param.page = $event.page;
    this.getInfo();
  }

  submit() {
    this.addStaff();
  }

  addStaffs() {
    this.isShow = true;
    if (this.orgType !== 3) {
      this.sharedService.get(`/BaseInfo/getStationUserId?stationCode=${this.orgCode}`, {
        animation: true
      })
      .subscribe(res => {
          this.joinStaffList = res.data;
          const selected = this.activedStaffList;
          this.joinStaffList.filter(el => selected.findIndex(item => item.userId === el.userId) > -1).forEach(el => {
            el.choose = true;
          });
      });
    }
  }

  teamsChange() {
    if (this.teams) {
      this.getStaffs();
    }
  }

  chooseAll() {
    this.joinStaffList.forEach(el => {
      el.choose = true;
    });
  }

  unChooseAll() {
    this.joinStaffList.forEach(el => {
      el.choose = false;
    });
  }

  getStaffs() {
    this.sharedService.get(`/ShiftChange/getUserByTeams?teams=${this.teams}&stationCode=${this.orgCode}`, {
      animation: true
    })
    .subscribe(res => {
        this.joinStaffList = res.data;
        const selected = this.activedStaffList;
        this.joinStaffList.filter(el => selected.findIndex(item => item.userId === el.userId) > -1).forEach(el => {
          el.choose = true;
        });
    });
  }

  chooseStaff(staff) {
    this.joinStaffList.forEach(el => {
      if (el.userId === staff.userId) {
        el.choose = !el.choose;
      }
    });
  }

  staffSubmit() {
    this.joinStaffList.filter(user => !user.choose).forEach(user => {
      const index = this.activedStaffList.findIndex(staff => staff.userId === user.userId);
      if (index > -1) {
        this.activedStaffList.splice(index, 1);
      }
    });
    const arr = this.activedStaffList.concat(this.joinStaffList.filter(user => user.choose));
    this.activedStaffList = [];
    arr.forEach(staff => {
      if (this.activedStaffList.findIndex(item => item.userId === staff.userId) === -1) {
        this.activedStaffList.push(staff);
      }
    });
    this.teams = 0;
    this.isShow = false;
    this.joinStaffList = [];
  }

  removeStaff(id) {
    this.activedStaffList = this.activedStaffList.filter(user => user.userId !== id);
  }

  staffCancel() {
    this.isShow = false;
    this.staffList = [];
  }

  upload(id) {
    const formdata = new FormData();
    formdata.append('file', this.file);
    formdata.append('id', id);
    this.sharedService.post(`/upload/trainDo`, formdata, {
      httpOptions: false
    }).subscribe(res => {
        if (res.code) {
          this.sharedService.addAlert('警告', res.message);
          this.file = null;
          this.filename = '';
        }
        this.toFirstPage();
      }, error => {
        this.sharedService.addAlert('警告', '上传失败，请重试！');
      });
  }
  downloadFile(type) {
    if (type === 'do') {
      window.open(this.doFilePath);
    } else {
      window.open(this.planFilePath);
    }
  }
  toFirstPage() {
    this.isChosen = false;
    this.param.page = 0;
    this.getInfo();
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res && res.isAdmin) {
        this.orgCode = res.orgCode;
        this.orgType = res.orgType;
        this.param.orgList = [res.orgCode];
        this.orgName = res.orgName;
        this.getInfo();
      }
    });
  }
}

