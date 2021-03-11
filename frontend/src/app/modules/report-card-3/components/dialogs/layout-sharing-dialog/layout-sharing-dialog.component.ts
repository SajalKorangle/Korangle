import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DesignReportCardComponent } from '../../../pages/design-report-card/design-report-card.component'

@Component({
  selector: 'app-layout-sharing-dialog',
  templateUrl: './layout-sharing-dialog.component.html',
  styleUrls: ['./layout-sharing-dialog.component.css'],
})
export class LayoutSharingDialogComponent implements OnInit {

  vm: DesignReportCardComponent;
  layoutSharingList: any[]=[];

  isSharing: boolean = false;
  fetchingSchoolList: boolean = false;

  schoolKidForSearch: number= null;
  schoolNameForSearch: string = '';

  schoolList: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.vm = data.vm;
    if(this.vm.currentLayout.id)
      this.layoutSharingList = this.vm.layoutSharingData[this.vm.currentLayout.id]
   }

  ngOnInit() {
  }

  shareCurrentLayoutWithSchool(kid:number): void{
    this.isSharing = true;
    this.vm.serviceAdapter.shareCurrentLayoutWithSchool(kid).then(res => {
      this.isSharing = false;
      this.layoutSharingList.push(res);
      alert('Layout Shared Successfully');
    })
  }

  layoutPublicAccessHandler(): void{
    this.isSharing = true;
    this.vm.serviceAdapter.currentLayoutPublicToggle().then(res => {
      this.isSharing = false;
    })
  }

  deleteLayoutSharing(index: number): void{
    this.isSharing = true;
    this.vm.serviceAdapter.deleteLayoutSharing(this.layoutSharingList[index]).then(res => {
      this.layoutSharingList.splice(index, 1);
      this.isSharing = false;
    });
  }

  getSchoolList(): void{
    this.fetchingSchoolList = true;
    const requestData: any = {
      id__startswith: this.schoolKidForSearch?this.schoolKidForSearch:'',
      name__startswith: this.schoolNameForSearch,
      korangle__count: '0,9',
    }
    this.vm.serviceAdapter.getSchoolList(requestData).then(response => {
      this.schoolList = response.filter(school=>school.id!=this.vm.user.activeSchool.dbId && this.layoutSharingList.every(ls=>ls.parentSchool!=school.id));
      this.fetchingSchoolList = false;
    });
  }

}
