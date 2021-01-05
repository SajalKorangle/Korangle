import { Inject,Component} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
    selector: 'image-pdf-preview-dialog',
    templateUrl: './image-pdf-preview-dialog.html',
    styleUrls: ['./image-pdf-preview-dialog.component.css'],
  })
  export class ImagePdfPreviewDialogComponent {
    
    constructor(
        public dialogRef: MatDialogRef<ImagePdfPreviewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) 
        public data: any) {
    }

    moveToIndex: any;
  
    onNoClick(): void {
        this.dialogRef.close();
    }
    
}