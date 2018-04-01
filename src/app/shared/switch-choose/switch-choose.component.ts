import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { list_group, shiftId } from '../../store/translate';

@Component({
  selector: 'app-switch-choose',
  templateUrl: './switch-choose.component.html',
  styleUrls: ['./switch-choose.component.scss']
})
export class SwitchChooseComponent implements OnInit, DoCheck {
  @Input()
  teams: string;

  @Input()
  userId: string;

  @Input()
  userName: string;

  @Output()
  chosenSchedule: EventEmitter<any> = new EventEmitter<any>();

  list_group = list_group;
  shiftId = shiftId;
  orgCode: string;
  cols: any;
  scheduleList: Array<any>;
  switchList: Array<any>;
  login: Observable<any> = new Observable<any>();
  _teams: string;
  _userId: string;
  switchTableShow = false;
  _username: string;
  loadingSchedule: boolean = false;

  constructor(
    private http: Http,
    private store: Store<any>
  ) {
    this.login = store.select('login');
    this.cols = [
      { field: 'userName', header: '申请人' },
      { field: 'userSex', header: '上班日期' },
      { field: 'politicalStatus', header: '班组' },
      { field: 'userTel', header: '班次' },
      { field: 'userMail', header: '排班类型' }
    ];
  }

  toggle() {
    this.switchTableShow = !this.switchTableShow;
  }

  getSchedule() {
    this.loadingSchedule = true;
    this.http.get(`http://119.29.144.125:8080/cgfeesys/ShiftChange/getScheduleByTeams?stationCode=${this.orgCode}&teams=${this._teams}&userId=${this._userId}`)
    .map(res => res.json())
    .subscribe(res => {
              this.loadingSchedule = false;
              this.scheduleList = res.data;
            });
  }

  chooseSchedule(schedule) {
    this._username = schedule.userName;
    this.chosenSchedule.emit(schedule);
    this.switchTableShow = false;
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res) {
        this.orgCode = res.orgCode;
      }
    });
    this._username = this.userName;
    if (this.teams && this.userId) {
      this._teams = this.teams;
      this._userId = this.userId;
      this.getSchedule();
    }
  }

  ngDoCheck() {
    if (this.teams && this.userId && (this.teams !== this._teams || this._userId !== this.userId)) {
      this._teams = this.teams;
      this._userId = this.userId;
      this.getSchedule();
    }
  }

}
