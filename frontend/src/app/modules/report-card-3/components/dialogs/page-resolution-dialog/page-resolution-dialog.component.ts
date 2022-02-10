import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PAGE_RESOLUTIONS, PageResolution } from '../../../class/constants_3';

@Component({
    selector: 'app-page-resolution-dialog',
    templateUrl: './page-resolution-dialog.component.html',
    styleUrls: ['./page-resolution-dialog.component.css'],
})
export class PageResolutionDialogComponent implements OnInit {
    pageResolutionsList: PageResolution[] = PAGE_RESOLUTIONS;

    activePageResolution: PageResolution;
    customPageResolution: PageResolution = new PageResolution('Custom', 100, 100);

    scaleFactor: number = 0.4;

    constructor(
        public dialogRef: MatDialogRef<PageResolutionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }
    ) {
        if (data.activePageResolution.resolutionName == 'Custom') {
            this.activePageResolution = data.activePageResolution;
            this.customPageResolution = this.activePageResolution;
        } else {
            this.pageResolutionsList.forEach((pr) => {
                if (pr.resolutionName == data.activePageResolution.resolutionName) {
                    this.activePageResolution = pr;
                    pr.orientation == data.activePageResolution.orientation;
                } else {
                    pr.orientation = 'p';
                }
            });
        }
    }

    ngOnInit() {}

    selectPageResolution(index: number) {
        this.activePageResolution = this.pageResolutionsList[index];
    }

    selectCustomPageResolution() {
        if (this.activePageResolution.resolutionName != 'Custom') {
            this.customPageResolution = new PageResolution(
                'Custom',
                this.activePageResolution.mm.height,
                this.activePageResolution.mm.width,
                this.activePageResolution.orientation
            );
            this.activePageResolution = this.customPageResolution; // ref to custom page resolution
        }
    }

    apply(): void {
        this.dialogRef.close(this.activePageResolution);
    }
}
