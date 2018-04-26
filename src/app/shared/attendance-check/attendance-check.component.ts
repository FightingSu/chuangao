import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SharedService } from '../../service/shared-service.service';

@Component({
  selector: 'app-attendance-check',
  templateUrl: './attendance-check.component.html',
  styleUrls: ['./attendance-check.component.scss']
})
export class AttendanceCheckComponent implements OnInit {
  cols: Array<any>;
  rows: Array<any>;
  options: any;
  selectionMode = 'single';
  orgList: Array<any>;
  year: number;
  yearList: Array<number> = [];
  staff: string;
  staffList: Array<Object>;
  attendanceList: Array<any> = [];
  updateOptions: any;
  orgType: number;
  orgCode: string;
  orgName: string;
  login: Observable<any> = new Observable<any>();

  constructor(
    private sharedService: SharedService,
    private store: Store<any>
  ) {
    this.login = store.select('login');
    this.initList();
  }

  selectedOrg($event) {
    this.orgList = $event;
    this.getStaff();
  }

  initList() {
    for (let i = 0; i < 12; i++) {
      this.attendanceList[i] = [];
      for (let j = 0; j < 20; j++) {
        this.attendanceList[i][j] = 0;
      }
    }
  }

  search() {
    if (!this.orgList || this.orgList.length <= 0) {
      alert('请选择机构！');
    } else if (this.orgList[0].orgType !== 3) {
      alert('请选择收费站！');
    } else if (!this.year) {
      alert('请选择年份！');
    } else if (!this.staff) {
      alert('请选择人员！');
    } else {
      this.getInfo();
    }
  }

  getInfo() {
    this.sharedService.post(`/Attendance/getYear`, JSON.stringify({
      stationCode: this.orgList[0].data,
      date: `${this.year}-01-01`,
      userId: this.staff
    }), {
      httpOptions: true
    }).subscribe(res => {
        this.initList();
        this.classify(res.data);
      });
  }

  classify(arr) {
    arr.forEach(el => {
      const mon = (new Date(el.attenceDate)).getMonth();
      const type = el.attenceType;
      const smallType = el.attenceSmallType;
      if (!this.attendanceList[mon]) {
        this.attendanceList[mon] = [];
      }
      if (smallType) {
        const index = type + smallType + 4;
        const num = this.attendanceList[mon][index];
        this.attendanceList[mon][index] = num ? num + 1 : 1;
      } else {
        const num = this.attendanceList[mon][type];
        this.attendanceList[mon][type] = num ? num + 1 : 1;
      }
    });
    this.updateChart();
  }

  updateChart() {
    const series: any = [{
      name: '正常上班',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '替班',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '加班',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '还班',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '休息',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '事假',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '病假',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '补休',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '年休',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '婚假',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '迟到',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '早退',
      type: 'bar',
      stack: 'one',
      data: []
    }, {
      name: '旷工',
      type: 'bar',
      stack: 'one',
      data: []
    }];
    this.attendanceList.forEach((el, index) => {
      series[0].data[index] = el[1];
      series[1].data[index] = el[2];
      series[2].data[index] = el[3];
      series[3].data[index] = el[6];
      series[4].data[index] = el[4];
      series[5].data[index] = el[10];
      series[6].data[index] = el[13];
      series[7].data[index] = el[12];
      series[8].data[index] = el[11];
      series[9].data[index] = el[15];
      series[10].data[index] = el[9];
      series[11].data[index] = el[8];
      series[12].data[index] = el[7];
    });
    this.updateOptions = {
      series: series
    };
  }

  getStaff() {
    this.sharedService.get(`/BaseInfo/getStationUserId?stationCode=${this.orgList[0].data}`, {
      animation: true
    })
            .subscribe(res => {
              this.staffList = res.data;
            });
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res) {
        this.orgType = res.orgType;
        this.orgCode = res.orgCode;
        this.orgName = res.orgName;
        this.orgList = [{
          data: res.orgCode,
          orgType: this.orgType
        }];
        this.getStaff();
      }
    });

    const year = (new Date()).getFullYear();
    const xAxisData: any = [];
    const data1 = [];
    const data2 = [];

    for (let i = 0; i < 10; i++) {
      this.yearList[i] = year - i;
    }
    this.year = year;
    this.staff = '0';

    this.rows = [
      { value: 1, name: '正常上班'},
      { value: 2, name: '替班'},
      { value: 3, name: '加班'},
      { value: 6, name: '还班'},
      { value: 4, name: '休息'},
      { value: 10, name: '事假'},
      { value: 13, name: '病假'},
      { value: 12, name: '补休'},
      { value: 11, name: '年休'},
      { value: 15, name: '婚假'},
      { value: 9, name: '迟到'},
      { value: 8, name: '早退'},
      { value: 7, name: '旷工'}
    ];
    this.cols = [
      { field: 0, header: '一月' },
      { field: 1, header: '二月' },
      { field: 2, header: '三月' },
      { field: 3, header: '四月' },
      { field: 4, header: '五月' },
      { field: 5, header: '六月' },
      { field: 6, header: '七月' },
      { field: 7, header: '八月' },
      { field: 8, header: '九月' },
      { field: 9, header: '十月' },
      { field: 10, header: '十一月' },
      { field: 11, header: '十二月' }
    ];

    for (let i = 0; i < 12; i++) {
      xAxisData.push(`${i + 1}月`);
    }

    this.options = {
      legend: {
        data: ['正常上班', '加班', '替班', '还班', '休息', '事假', '病假', '补休', '年休', '婚假', '迟到', '早退', '旷工'],
        align: 'left'
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false
        }
      },
      yAxis: {
      },
      series: [{
        name: '正常上班',
        type: 'bar',
        stack: 'one'
      }, {
        name: '替班',
        type: 'bar',
        stack: 'one',
        data: data2
      }, {
        name: '加班',
        type: 'bar',
        stack: 'one',
        data: data2
      }, {
        name: '还班',
        type: 'bar',
        stack: 'one',
        data: data2
      }, {
        name: '休息',
        type: 'bar',
        stack: 'one',
        data: data2
      }, {
        name: '事假',
        type: 'bar',
        stack: 'one',
        data: data2
      }, {
        name: '病假',
        type: 'bar',
        stack: 'one',
        data: data2
      }, {
        name: '补休',
        type: 'bar',
        stack: 'one',
        data: data2
      }, {
        name: '年休',
        type: 'bar',
        stack: 'one',
        data: data2
      }, {
        name: '婚假',
        type: 'bar',
        stack: 'one',
        data: data2
      }, {
        name: '迟到',
        type: 'bar',
        stack: 'one',
        data: data2
      }, {
        name: '早退',
        type: 'bar',
        stack: 'one',
        data: data2
      }, {
        name: '旷工',
        type: 'bar',
        stack: 'one',
        data: data2
      }]
    };
  }
}
