import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PAGE_RESOLUTIONS, PageResolution, CUSTOM_PAGE_RESOLUTION_INDEX, getStructeredPageResolution} from './../../class/constants_3';

@Component({
  selector: 'app-page-resolution-dialog',
  templateUrl: './page-resolution-dialog.component.html',
  styleUrls: ['./page-resolution-dialog.component.css']
})
export class PageResolutionDialogComponent implements OnInit {

  pageResolutionsList: PageResolution[] = PAGE_RESOLUTIONS;

  activePageResolution: PageResolution;

  scaleFactor: number = 0.4;

  constructor(public dialogRef: MatDialogRef<PageResolutionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) { 
    this.activePageResolution = data.activePageResolution;
  }

  ngOnInit() {
  }

  selectPageResolution(index: number) {
    this.activePageResolution = this.pageResolutionsList[index];
  }

  selectCustomPageResolution() {
    this.activePageResolution = this.pageResolutionsList[CUSTOM_PAGE_RESOLUTION_INDEX];
  }

  apply():void {
    if (this.activePageResolution.resolutionName == 'Custom') {
      this.pageResolutionsList[CUSTOM_PAGE_RESOLUTION_INDEX] = getStructeredPageResolution('Custom', this.activePageResolution.mm.height, this.activePageResolution.mm.width);
      this.activePageResolution = this.pageResolutionsList[CUSTOM_PAGE_RESOLUTION_INDEX];
    }
    this.dialogRef.close(this.activePageResolution);
  }

}
