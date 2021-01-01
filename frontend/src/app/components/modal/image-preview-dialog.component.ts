import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



export interface ImagePreviewDialogData {
    homeworkImages: any;
    index: any;
    editable: any;
    isMobile: any;
}


@Component({
    selector: 'image-preview-dialog',
    templateUrl: 'image-preview-dialog.html',
    styleUrls: ['./image-preview-dialog.css'],
})

export class ImagePreviewDialogComponent {
    
    constructor(
        public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) 
        public data: ImagePreviewDialogData,) {
            this.moveToIndex = this.data.index;
    }

    moveToIndex: any;

    imageStyle = {
        'display': 'inline-block',
        'margin': 'auto',
        'width': '50%',
    }
    increaseSize(): any{
        this.imageStyle.width = '100%';
    }
    decreaseSize(): any{
        this.imageStyle.width = '50%';
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    
    decreaseIndex(): void{
        this.data.index = this.data.index - 1;
        if(this.data.index < 0)
            this.data.index = this.data.homeworkImages.length - 1;
        this.moveToIndex = this.data.index;
        this.imageStyle.width = '50%';
    }

    
    increaseIndex(): void{
        this.data.index = this.data.index + 1;
        if(this.data.index == this.data.homeworkImages.length)
            this.data.index = 0;
        this.moveToIndex = this.data.index;
        this.imageStyle.width = '50%';
    }

    removeImage(index: any):any{
        this.data.homeworkImages.splice(index, 1);
        if(this.data.homeworkImages.length == 0){
            this.dialogRef.close();
        }
        if(index == this.data.index){
            this.decreaseIndex();
        }
    }   

    moveImage(){
        let temp = this.data.homeworkImages[this.data.index];
        this.data.homeworkImages.splice(this.data.index, 1);
        this.data.homeworkImages.splice(this.moveToIndex, 0, temp);
        this.data.index = this.moveToIndex;
        this.imageStyle.width = '50%';
    }

    
}