import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../../service/shared-service.service';

@Component({
  selector: 'app-toll-station-images',
  templateUrl: './toll-station-images.component.html',
  styleUrls: ['./toll-station-images.component.scss']
})
export class TollStationImagesComponent implements OnInit {
  login: Observable<any>;
  imgArr: Array<any> = [];
  bigNewsImgArr: Array<any> = [];
  hisHorImgArr: Array<any> = [];
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
      () => this.getImages(this.orgCode)
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
        () => {
          this.getImages(this.orgCode);
          this.getInfo();
        }
      )
    })
  }

  getInfo() {
    this.sharedService.get(
      `/BaseInfo/getStationInfo?stationCode=${this.orgCode}`,
      {
        successAlert: false,
        animation: true
      }
    ).subscribe(
      res => {
        this.bigNewsImgArr = res.data.stationImg1;
        this.hisHorImgArr = res.data.stationImg2;
      }
    );
  }

  uploadImgArr($event, type) {
    const formdata = new FormData();
    formdata.append('file', $event.target.files[0]);
    formdata.append('stationCode', this.orgCode);
    formdata.append('type', type);
    this.sharedService.post(
      '/upload/station',
      formdata,
      {
        httpOptions: false,
        successAlert: true,
        animation: true
      }
    ).subscribe(
      () => this.getInfo()
    );
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res && res.orgType === 3) {
        this.orgCode = res.orgCode;
        this.getImages(res.orgCode);
        this.getInfo();
      }
    }).unsubscribe();
  }

}
