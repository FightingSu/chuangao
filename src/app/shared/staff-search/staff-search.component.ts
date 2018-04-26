import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { work_post, politics, educational, list_group } from '../../store/translate';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SharedService } from '../../service/shared-service.service';

@Component({
  selector: 'app-staff-search',
  templateUrl: './staff-search.component.html',
  styleUrls: ['./staff-search.component.scss']
})
export class StaffSearchComponent implements OnInit {
  form: FormGroup;
  login: Observable<any> = new Observable<any>();
  birthday: string;
  hireDate: string;
  count: number;
  initOrgName: string;
  work_post = work_post;
  politics = politics;
  educational = educational;
  staffList: Array<any>;
  orgList: Array<any>;
  page = 0;
  size = 15;
  hasData = false;
  param: any = {};
  selectionMode = 'checkbox';
  listGroup = list_group;
  en = {
    firstDayOfWeek: 0,
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
    dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  };
  cols: any;
  numberArr: Array<string> = ['workPost', 'political_status', 'educational', 'listGroup'];

  constructor(
    private sharedService: SharedService,
    private store: Store<any>
  ) {
    this.login = store.select('login');
    this.form = new FormGroup({
      orgName: new FormControl('', Validators.nullValidator),
      listGroup: new FormControl('', Validators.nullValidator),
      userName: new FormControl('', Validators.nullValidator),
      workPost: new FormControl('', Validators.nullValidator),
      userSex: new FormControl('', Validators.nullValidator),
      educational: new FormControl('', Validators.nullValidator),
      political_status: new FormControl('', Validators.nullValidator),
      specialSkill: new FormControl('', Validators.nullValidator)
    });
    this.cols = [
      { field: 'userName', header: '姓名' },
      { field: 'userSex', header: '性别' },
      { field: 'politicalStatus', header: '政治面貌' },
      { field: 'userTel', header: '手机号码' },
      { field: 'userMail', header: '邮箱' },
      { field: 'workPost', header: '岗位' },
      { field: 'educational', header: '学历' },
      { field: 'listGroupCN', header: '班组' },
      { field: 'orgName', header: '组织名称' }
    ];
  }

  dateFormat(date) {
    if (date) {
      const _date = new Date(date);
      const _month = (_date.getMonth() + 1) <= 9 ? `0${(_date.getMonth() + 1)}` : _date.getMonth();
      const _day = _date.getDate() <= 9 ? `0${_date.getDate()}` : _date.getDate();
      return `${_date.getFullYear()}-${_month}-${_day}`;
    }else {
      return '';
    }
  }

  selectedOrg($event) {
    this.orgList = $event;
  }

  submit() {
    if (!this.orgList || this.orgList.length === 0) {
      alert('未选择机构');
    }else {
      this.getInfo(this.page, this.size);
    }
  }

  paginate(event) {
    this.getInfo(event.page, this.size);
  }

  getInfo(page: number, size: number) {
    this.form.value.birthday = this.dateFormat(this.birthday);
    this.form.value.hireDate = this.dateFormat(this.hireDate);
    this.form.value.orgList = this.orgList.map(el => el.data);
    this.param = {
      page: page,
      size: size,
    };
    const keys = Object.keys(this.form.value);
    keys.forEach(el => {
      if (this.form.value[el] || this.form.value[el] === 0) {
        this.param[el] = this.form.value[el];
      }
    });
    this.numberArr.forEach(el => {
      if (this.param[el]) {
        this.param[el] = +this.param[el];
      }
    });
    this.sharedService.post('/StaffMag/getStaff', JSON.stringify(this.param), {
      httpOptions: true
    })
      .subscribe(res => {
        this.count = res.data.count;
        if (res.data.count > 0) {
          this.hasData = true;
          this.staffList = res.data.staffDataList.map(el => {
            el.politicalStatus = this.politics[el.politicalStatus];
            el.workPost = this.work_post[el.workPost];
            el.educational = this.educational[el.educational];
            el.listGroup = this.listGroup[el.listGroup];
            return el;
          });
        } else {
          this.sharedService.addAlert('警告', '没有匹配的人员信息，请重新设置查询条件！');
        }
      });
  }

  resetPwd(id) {
    this.sharedService.get(`/resetPassword?userId=${id}`, {
      animation: true
    })
        .subscribe(res => {
            this.sharedService.addAlert('警告', '重置成功');
        });
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res) {
        this.initOrgName = res.orgName;
        this.orgList = [{
          data: res.orgCode,
          orgType: res.orgType
        }];
      }
    });
  }

}
