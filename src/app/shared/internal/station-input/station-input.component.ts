import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-station-input',
  templateUrl: './station-input.component.html',
  styleUrls: ['./station-input.component.scss']
})
export class StationInputComponent implements OnInit {
  data: any = {};
  form: FormGroup;
  myOrgCode: string;
  requiredItems = {
    meetingName: '会议名称',
    meetingPlace: '会议地址',
    meetingHost: '主持人',
    meetingNote: '记录人',
    meetingContent: '会议内容'
  };
  orgType: number;
  startDate: string;
  uploading = false;
  orgCode: Array<any> = [];
  en: any;
  stationName: string;
  file: any;
  orgList: Array<any>;
  filename: string;
  isChosen = false;
  login: Observable<any> = new Observable<any>();
  page = 0;
  size = 15;
  count: number;
  staffList: Array<any>;
  hasData: boolean;
  updateUrl = `http://119.29.144.125:8080/cgfeesys/User/setUserDetail`;
  cols: Array<any>;
  selectedUser = '';
  isAdd: boolean;
  keys: Array<any>;
  selectionMode = 'single';
  searchOrg: Array<any>;
  initForm: any;
  param: any = {
    page: this.page,
    size: this.size,
    meetingName: '',
    startDate: '',
    endDate: ''
  };
  isShow = false;
  teams = 0;
  activedStaffList: Array<any> = [];
  joinStaffList: Array<any> = [];

  constructor(
    private http: Http,
    private store: Store<any>
  ) {
    this.form = new FormGroup({
      meetingName: new FormControl('', Validators.nullValidator),
      meetingPlace: new FormControl('', Validators.nullValidator),
      meetingHost: new FormControl('', Validators.nullValidator),
      meetingNote: new FormControl('', Validators.nullValidator),
      meetingContent: new FormControl('', Validators.nullValidator)
    });
    this.searchOrg = [];
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
      { field: 'meetingName', header: '会议名称' },
      { field: 'meetingPlace', header: '会议地点' },
      { field: 'meetingHost', header: '所属机构' },
      { field: 'meetingDate', header: '会议时间' },
      { field: 'meetingHost', header: '主持人' },
      { field: 'meetingNote', header: '记录人' },
      { field: 'meetingJoinPeopleStr', header: '参会人员' },
      { field: 'meetingContent', header: '会议内容' }
    ];
    this.initForm = {
      meetingName: '',
      meetingPlace: '',
      meetingHost: '',
      meetingNote: '',
      meetingJoinPeople: '',
      meetingContent: ''
    };
  }

  selectedOrg($event) {
    this.orgCode = ($event);
  }
  selectedSearchOrg($event) {
    this.searchOrg = ($event);
  }
  getStaffInfo(staffId) {
    this.staffList.forEach(item => {
      if (item.id === staffId) {
        this.form.patchValue(item);
        this.startDate = item.meetingDate;
        this.stationName = item.stationName;
        this.activedStaffList = item.meetingJoinPeople;
      }
    });
  }
  getInfo() {
    if (this.searchOrg.length !== 0) {
      this.param.orgList = this.searchOrg.map(el => el.data);
    }
    const myHeaders: Headers = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    this.http.post('http://119.29.144.125:8080/cgfeesys/StationMeeting/get', JSON.stringify(this.param) , {
              headers: myHeaders
            })
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                this.count = res.data.count;
                if (res.data.count > 0) {
                  this.hasData = true;
                  res.data.stationMeetingDataList.forEach(el => {
                    if (el.meetingJoinPeople && el.meetingJoinPeople.length > 0) {
                      el.meetingJoinPeopleStr = el.meetingJoinPeople.map(item => item.userName).join(',');
                    }
                  });
                  this.staffList = res.data.stationMeetingDataList;
                }
              } else {
                alert(res.message);
              }
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
    // this.form.patchValue({orgName: this.orgName});
    this.filename = '';
    this.isChosen = true;
    this.isAdd = true;
  }

  search() {
    if (this.searchOrg && this.searchOrg.length !== 0) {
      this.getInfo();
      this.toFirstPage();
    } else {
      alert('请输入要查询的组织机构！');
    }
  }

  update() {
    if (this.selectedUser) {
      this.getStaffInfo(this.selectedUser);
      this.isChosen = true;
      this.isAdd = false;
    } else {
      alert('请选择一个文件');
    }
  }

  delete() {
    if (this.selectedUser) {
      this.staffLeave(this.selectedUser);
    } else {
      alert('请选择一个文件');
    }
  }

  select(val) {
    this.selectedUser = val === this.selectedUser ? '' : val;
  }

  check(val) {
    return val === this.selectedUser;
  }

  staffLeave(selectedUser) {
    this.http.get(`http://119.29.144.125:8080/cgfeesys/StationMeeting/delete?id=${selectedUser}`)
            .map(res => res.json())
            .subscribe(res => {
              alert(res.message);
              if (res.code) {
                this.toFirstPage();
              }
            });
  }

  addStaff() {
    const spaceArr = this.keys.filter(el => !this.form.value[el] && this.form.value[el] !== 0).map(el => this.requiredItems[el]);
    if (spaceArr.length > 0) {
      alert(`${spaceArr.join(',')}为空`);
    } else if (this.orgCode.length === 0) {
      alert('请选择所属机构！');
    } else if (!this.startDate) {
      alert('请选择会议时间');
    } else if (!this.activedStaffList.length) {
      alert('请选择参与人员！');
    }else {
      this.uploading = true;
      const myHeaders: Headers = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      this.form.value.meetingDate = this.dateFormat(this.startDate);
      // this.form.value.orgType = +this.orgType;
      this.form.value.stationCode = this.orgCode[0].data;
      this.form.value.meetingJoinPeople = this.activedStaffList.map(el => el.userId);
      // this.form.value.politicalStatus = +this.form.value.politicalStatus;
      // this.form.value.positionalTitle = +this.form.value.positionalTitle;
      // this.form.value.userId = '' + Math.round(1000 * Math.random());
      this.http.post(`http://119.29.144.125:8080/cgfeesys/StationMeeting/add`, JSON.stringify(this.form.value), {
                headers: myHeaders
              })
              .map(res => res.json())
              .subscribe(res => {
                if (res.code) {
                  if (this.file) {
                    this.upload(res.data.id);
                  } else {
                    alert('添加成功！');
                    this.toFirstPage();
                    this.uploading = false;
                  }
                } else {
                  alert(res.message);
                  this.uploading = false;
                }
              });
    }
  }

  updateStaff() {
    const spaceArr = this.keys.filter(el => !this.form.value[el] && this.form.value[el] !== 0).map(el => this.requiredItems[el]);
    if (spaceArr.length > 0) {
      alert(`${spaceArr.join(',')}为空`);
    } else if (this.orgCode.length === 0) {
      alert('请选择所属机构！');
    } else if (!this.startDate) {
      alert('请选择会议时间');
    } else {
      this.uploading = true;
      const myHeaders: Headers = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const keys = Object.keys(this.form.value);
      keys.forEach(el => {
        this.data[el] = this.form.value[el];
      });
      this.data.meetingDate = this.dateFormat(this.startDate);
      this.data.stationCode = this.orgCode[0].data;
      this.data.id = this.selectedUser;
      this.data.meetingJoinPeople = this.activedStaffList.map(el => el.userId);
      console.log(this.data);
      this.http.post(`http://119.29.144.125:8080/cgfeesys/StationMeeting/update`, JSON.stringify(this.data), {
                headers: myHeaders
              })
              .map(res => res.json())
              .subscribe(res => {
                if (res.code) {
                  if (this.file) {
                    this.upload(this.selectedUser);
                  } else {
                    this.toFirstPage();
                    this.uploading = false;
                  }
                } else {
                  alert(res.message);
                  this.uploading = false;
                }
              });
      }
  }

  paginate($event) {
    this.param.page = $event.page;
    this.getInfo();
  }

  submit() {
    if (this.uploading) {
      alert('正在上传中，请等待完成！');
    }else {
      if (this.isAdd) {
        this.addStaff();
      } else {
        this.updateStaff();
      }
    }
  }

  addStaffs() {
    this.isShow = true;
  }

  teamsChange() {
    if (this.teams) {
      this.getStaffs();
    }
  }

  getStaffs() {
    this.http.get(`http://119.29.144.125:8080/cgfeesys/ShiftChange/getUserByTeams?teams=${this.teams}&stationCode=${this.myOrgCode}`)
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                this.joinStaffList = res.data;
                const selected = this.activedStaffList;
                this.joinStaffList.filter(el => selected.findIndex(item => item.userId === el.userId) > -1).forEach(el => {
                  el.choose = true;
                });
              }
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

  chooseAll() {
    if (this.teams) {
      this.joinStaffList.forEach(el => {
        el.choose = true;
      });
    }
  }

  unChooseAll() {
    if (this.teams) {
      this.joinStaffList.forEach(el => {
        el.choose = false;
      });
    }
  }

  upload(userId) {
    const formdata = new FormData();
    formdata.append('file', this.file);
    formdata.append('id', userId);
    this.http.post(`http://119.29.144.125:8080/cgfeesys/upload/stationMeeting`, formdata)
      .map(res => res.json())
      .subscribe(res => {
        if (res.code) {
          alert(res.message);
        } else {
          alert(res.message);
        }
        this.toFirstPage();
        this.uploading = false;
      }, error => {
        alert('上传失败，请重试！');
        this.uploading = false;
      });
  }

  toFirstPage() {
    this.isChosen = false;
    if (document.getElementsByClassName('ui-paginator-page')[0]) {
      const element = document.getElementsByClassName('ui-paginator-page')[0] as HTMLElement;
      element.click();
    } else {
      this.getInfo();
    }
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res && res.isAdmin) {
        this.searchOrg = [{data: res.orgCode, label: res.orgName}];
        this.orgType = res.orgType;
        this.stationName = res.orgName;
        if (this.orgType === 3) {
          this.orgCode = [{
            data: res.orgCode,
            orgType: res.orgType
          }];
        }
        this.myOrgCode = res.orgCode;
        this.getInfo();
      }
    });
  }
}
