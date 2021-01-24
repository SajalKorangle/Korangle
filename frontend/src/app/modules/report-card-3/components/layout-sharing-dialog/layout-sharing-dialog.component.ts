import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DesignReportCardComponent } from './../../pages/design-report-card/design-report-card.component'

@Component({
  selector: 'app-layout-sharing-dialog',
  templateUrl: './layout-sharing-dialog.component.html',
  styleUrls: ['./layout-sharing-dialog.component.css']
})
export class LayoutSharingDialogComponent implements OnInit {

  vm: DesignReportCardComponent;
  layoutSharingList: any[]=[];

  isSharing: boolean = false;

  newKIDForSharing: number = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.vm = data.vm;
    if(this.vm.currentLayout.id)
      this.layoutSharingList = this.vm.layoutSharingData[this.vm.currentLayout.id]
   }

  ngOnInit() {
  }

  shareCurrentLayoutWithSchool(): void{
    if (this.newKIDForSharing) {
      this.isSharing = true;
      this.vm.serviceAdapter.shareCurrentLayoutWithSchool(this.newKIDForSharing).then(res => {
        this.isSharing = false;
        this.newKIDForSharing = null;
        console.log('response = ', res);
        this.layoutSharingList.push(res);
        alert('Layout Shared Successfully');
      })
    }
  }

  layoutPublicAccessHandler(): void{
    this.isSharing = true;
    this.vm.serviceAdapter.currentLayoutPublicToggle().then(res => {
      this.isSharing = false;
    })
  }

  deleteLayoutSharing(index: number): void{
    console.log('sharing data to be deleted = ', index);
    this.isSharing = true;
    this.vm.serviceAdapter.deleteLayoutSharing(this.layoutSharingList[index]).then(res => {
      this.layoutSharingList.splice(index, 1);
      this.isSharing = false;
    });
  }

}
