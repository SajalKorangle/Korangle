import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DesignReportCardComponent } from './../../report-card-3/pages/design-report-card/design-report-card.component'

@Component({
  selector: 'app-layout-sharing-dialog',
  templateUrl: './layout-sharing-dialog.component.html',
  styleUrls: ['./layout-sharing-dialog.component.css']
})
export class LayoutSharingDialogComponent implements OnInit {

  vm: DesignReportCardComponent;
  layoutAccessList: any[]=[];

  isSharing: boolean = false;

  newKIDForSharing: number = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.vm = data.vm;
    if(this.vm.currentLayout.id)
      this.layoutAccessList = this.vm.layoutAccessData[this.vm.currentLayout.id]
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
        this.layoutAccessList.push(res);
        alert('Layout Shared Successfully');
      })
    }
  }

}
