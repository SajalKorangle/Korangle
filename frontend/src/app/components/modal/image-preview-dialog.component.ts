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
        'display': 'table-cell',
        'margin': 'auto',
        'width': '50%',
        'height': '50%',
    }
    maxSize = false;
    minSize = false;

    increaseSize(): any{
        this.minSize = false;
        let currentWidth = this.imageStyle.width;
        if(currentWidth.length == 3){
            this.imageStyle.width = '100%';
            this.imageStyle.height = '100%';
        }
        else{
            if(currentWidth[1] == '5'){
                this.imageStyle.width = '200%';
                this.imageStyle.height = '200%';
            }
            else if(currentWidth[0] == '1'){
                this.imageStyle.width = '150%';
                this.imageStyle.height = '150%';
            }
            else{
                this.maxSize = true;
            }
        }
    }
    decreaseSize(): any{
        this.maxSize = false;
        let currentWidth = this.imageStyle.width;
        if(currentWidth.length == 3){
            this.minSize = true;
        }
        else{
            if(currentWidth[1] == '5'){
                this.imageStyle.width = '100%';
                this.imageStyle.height = '100%';
            }
            else if(currentWidth[0] == '1'){
                this.imageStyle.width = '50%';
                this.imageStyle.height = '50%';
            }
            else if(currentWidth[0] == '2'){
                this.imageStyle.width = '150%';
                this.imageStyle.height = '150%';
            }
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    
    decreaseIndex(): void{
        this.data.index = this.data.index - 1;
        if(this.data.index < 0)
            this.data.index = this.data.homeworkImages.length - 1;
            this.moveToIndex = this.data.index;
    }

    
    increaseIndex(): void{
        this.data.index = this.data.index + 1;
        if(this.data.index == this.data.homeworkImages.length)
            this.data.index = 0;
        this.moveToIndex = this.data.index;
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
    }

    
}