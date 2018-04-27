import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SharedService } from '../../../service/shared-service.service';

@Component({
  selector: 'app-talk-static',
  templateUrl: './talk-static.component.html',
  styleUrls: ['./talk-static.component.scss']
})
export class TalkStaticComponent implements OnInit {
  cols: Array<any>;
  rows: Array<any>;
  options: any;
  selectionMode = 'single';
  orgList: Array<any>;
  year: number;
  yearList: Array<number> = [];
  staff: string;
  staffList: Array<Object>;
  talkList: Array<Object>;
  attendanceList: Array<any> = [];
  updateOptions: any;
  orgType: number;
  orgCode: string;
  orgName: string;
  login: Observable<any> = new Observable<any>();

  constructor(
    private store: Store<any>,
    private sharedService: SharedService
  ) {
    this.login = store.select('login');
  }

  selectedOrg($event) {
    this.orgList = $event;
    this.getStaff();
  }

  search() {
    if (!this.orgList || this.orgList.length <= 0) {
      this.sharedService.addAlert('警告', '未选择机构！');
    } else if (this.orgList[0].orgType !== 3) {
      this.sharedService.addAlert('警告', '请选择收费站！');
    } else if (!this.year) {
      this.sharedService.addAlert('警告', '请选择年份！');
    } else {
      this.getInfo();
    }
  }

  getInfo() {
    this.sharedService.post(`/Train/trainStatistics`, JSON.stringify({
      orgCode: this.orgList[0].data,
      year: `${this.year}-01-01`,
      userId: this.staff
    }), {
      httpOptions: true,
      animation: true
    })
      .subscribe(res => {
          this.talkList = res.data;
          this.updateChart(res.data);
      });
  }

  updateChart(data) {
    const series: any = [{
      name: '',
      type: 'bar',
      data: [
        {
          value: 0,
          itemStyle: {
            color: '#c23531'
          }
        }, {
          value: 0,
          itemStyle: {
            color: '#37A2DA'
          }
        }, {
          value: 0,
          itemStyle: {
            color: '#32C5E9'
          }
        }, {
          value: 0,
          itemStyle: {
            color: '#32C5E9'
          }
        }, {
          value: 0,
          itemStyle: {
            color: '#9FE6B8'
          }
        }, {
          value: 0,
          itemStyle: {
            color: '#FFDB5C'
          }
        }, {
          value: 0,
          itemStyle: {
            color: '#ff9f7f'
          }
        }, {
          value: 0,
          itemStyle: {
            color: '#fb7293'
          }
        }]
    }];
    data.forEach((el) => {
      el.types.forEach( (item, index) => {
        series[0].data[index].value += item;
      });
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
    const year = (new Date()).getFullYear();
    for (let i = 0; i < 10; i++) {
      this.yearList[i] = year - i;
    }
    this.year = year;
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
        this.search();
      }
    }).unsubscribe();

    const xAxisData: any = [
      '文明礼仪培训',
      '稽查业务培训',
      '机电培训',
      '安全培训',
      '综合培训',
      '应急演练',
      '劳动竞赛',
      '收费业务培训'
    ];
    const data1 = [];
    const data2 = [];

    this.cols = [
      { field: 0, header: '文明礼仪' },
      { field: 1, header: '稽查业务' },
      { field: 2, header: '机电培训' },
      { field: 3, header: '安全培训' },
      { field: 4, header: '综合培训' },
      { field: 5, header: '应急演练' },
      { field: 6, header: '劳动竞赛' },
      { field: 7, header: '收费业务' }
    ];

    this.options = {
      legend: {
        data: ['文明礼仪培训', '稽查业务培训', '机电培训', '安全培训', '综合培训', '应急演练', '劳动竞赛', '收费业务培训'],
        align: 'left'
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        type: 'category',
        silent: false,
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        name: '培训小时',
        minInterval: 1
      },
      series: [{
        name: '',
        type: 'bar',
        data: []
      }]
    };
  }
}
