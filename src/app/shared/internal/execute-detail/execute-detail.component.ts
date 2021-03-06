import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { SharedService } from '../../../service/shared-service.service';

@Component({
  selector: 'app-execute-detail',
  templateUrl: './execute-detail.component.html',
  styleUrls: ['./execute-detail.component.scss']
})
export class ExecuteDetailComponent implements OnInit {
  id: string;
  countList: Array<any>;
  trainPlanData: any;
  cols: any;

  constructor(
    private router: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.id = this.router.snapshot.queryParams['id'];
    this.cols = [
      { field: 'trainName', header: '培训计划名称' },
      { field: 'trainOrgName', header: '发起单位' },
      { field: 'trainStartDate', header: '计划开始时间' },
      { field: 'trainEndDate', header: '计划结束时间' },
      { field: 'trainWay', header: '培训方式' },
      { field: 'trainType', header: '培训类别' },
      { field: 'trainTeacher', header: '培训讲师' },
      { field: 'trainTimeLong', header: '培训课时' },
      { field: 'trainLoc', header: '培训地点' }
    ];
  }

  getInfo(id) {
    this.sharedService
      .get(`/Train/planGetById?id=${id}`, {
        animation: true
      })
      .subscribe(res => {
        this.trainPlanData = res.data.trainPlanData;
        res.data.trainDoListDataList.forEach(el => {
          // el.trainDoDetailDataList.forEach(element => {
          el.trainHasDo = el.trainTimeLong === 0 ? '已落实' : '未落实';
          // })
        });
        this.countList = res.data.trainDoListDataList;
        window.sessionStorage.setItem('execute', JSON.stringify(res.data));

      });
  }

  goBack() {
    window.history.back();
  }

  ngOnInit() {
    if (this.id) {
      this.getInfo(this.id);
    }
  }

}
