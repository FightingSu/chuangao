import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SharedService } from "../../../service/shared-service.service";

@Component({
  selector: 'app-image-control',
  templateUrl: './road-company-images-control.component.html',
  styleUrls: ['./road-company-images-control.component.scss']
})
export class RoadCompanyImagesControlComponent implements OnInit {
  login: Observable<any>;
  imgArr: Array<any> = [];
  orgCode: string;

  constructor(
    private store: Store<any>,
    private sharedService: SharedService
  ) {
    this.login = store.select('login');
  }

  getImages(orgCode) {
    this.sharedService.get(
      `/BaseInfo/getOrgPicPath?orgCode=${orgCode}`,
      {
        successAlert: false,
        animation: true
      }
    ).subscribe(
      res => this.imgArr = res.data
    );
  }

  upload($event) {
    const formdata = new FormData();
    formdata.append('file', $event.target.files[0]);
    formdata.append('orgCode', this.orgCode);
    this.sharedService.post(
      '/upload/baseInfo',
      formdata,
      {
        httpOptions: false,
        successAlert: true,
        animation: true
      }
    ).subscribe(
      res => this.getImages(this.orgCode)
    );
  }

  delete(id) {
    this.sharedService.addConfirm('警告', '确认删除该图片？').subscribe(res => {
      this.sharedService.get(
        `/BaseInfo/deleteOrgPic?fileId=${id}`,
        {
          successAlert: true,
          animation: true
        }
      ).subscribe(
        res => this.getImages(this.orgCode)
      )
    })
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res && res.orgType === 1) {
        this.orgCode = res.orgCode;
        this.getImages(res.orgCode);
      }
    }).unsubscribe();
  }

}
