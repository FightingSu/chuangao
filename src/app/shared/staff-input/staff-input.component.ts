import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../service/shared-service.service';

@Component({
  selector: 'app-staff-input',
  templateUrl: './staff-input.component.html',
  styleUrls: ['./staff-input.component.scss']
})
export class StaffInputComponent implements OnInit {
  data: any = {};
  form: FormGroup;
  staffId: string;
  hireDate: string;
  birthday: string;
  en: any;
  changeTime: string;
  file: any;
  filename: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.form = new FormGroup({
      orgName: new FormControl('', Validators.nullValidator),
      userName: new FormControl('', Validators.nullValidator),
      userSex: new FormControl('', Validators.nullValidator),
      educational: new FormControl('', Validators.nullValidator),
      practitionerCertificate: new FormControl('', Validators.nullValidator),
      userTel: new FormControl('', Validators.nullValidator),
      workPost: new FormControl('', Validators.nullValidator),
      politics: new FormControl('', Validators.nullValidator),
      positionalTitle: new FormControl('', Validators.nullValidator),
      emergencyContact: new FormControl('', Validators.nullValidator),
      emergencyPhone: new FormControl('', Validators.nullValidator),
      collectionSysId: new FormControl('', Validators.nullValidator),
      workLicense: new FormControl('', Validators.nullValidator),
      userMail: new FormControl('', Validators.nullValidator),
      jobDetail: new FormControl('', Validators.nullValidator),
      awardDetail: new FormControl('', Validators.nullValidator),
      specialSkill: new FormControl('', Validators.nullValidator)
    });
    this.staffId = this.route.snapshot.queryParams['id'];
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
  }

  getInfo(staffId) {
    this.sharedService.get(`/User/getUserDetail?userId=${staffId}`, {
      animation: true
    })
      .subscribe(res => {
        this.data = res.data;
        this.form.patchValue(res.data);
        this.hireDate = res.data.hireDate;
        this.birthday = res.data.birthday;
      });
  }

  btn() {
    console.log(this.hireDate);
  }

  submit() {

  }

  fileChange($event) {
    this.filename = $event.target.files[0].name;
    this.file = $event.target.files[0];
  }

  ngOnInit() {
    if (this.staffId) {
      this.getInfo(this.staffId);
    }else {
      this.router.navigate(['main/home']);
    }
  }

}
