import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { showPhoto } from '../../classes/common.js';

import { trigger, transition, query, style, animate, group } from '@angular/animations';
const left = [
  group([
    query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.3s linear', style({ transform: 'translateX(0%)' }))], {
        optional: true,
      }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s linear', style({ transform: 'translateX(100%)' }))], {
        optional: true,
      }),
  ]),
];

const right = [
    group([
      query(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s linear', style({ transform: 'translateX(0%)' }))], {
        optional: true,
      }),
      query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s linear', style({ transform: 'translateX(-100%)' }))], {
        optional: true,
      }),
    ]),
  ];

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
    animations: [
        trigger('animImageSlider', [
          transition(':increment', right),
          transition(':decrement', left),
        ]),
    ]
})

export class ImagePreviewDialogComponent {
    
    constructor(
        public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) 
        public data: ImagePreviewDialogData,) {
            this.moveToIndex = this.data.index;
            this.counter = this.data.index;
    }

    moveToIndex: any;
    counter: number = 0;

    imageStyle = {
        'display': 'inline-block',
        'margin': 'auto',
        'width': '50%',
        'animation': '',
        'opacity': '1',
    }

    imageStyleMobile = {
        'display': 'inline-block',
        'margin': 'auto',
        'width': '100%',
        'transition': '',
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
    
    increaseSizeMobile(): any{
        let tempstr = '';
        for(let i=0; i<this.imageStyleMobile.width.length; i++){
            if(this.imageStyleMobile.width[i] == '%'){
                break;
            }
            else{
                tempstr = tempstr + this.imageStyleMobile.width[i];
            }
        }
        let tempWidth = Number(tempstr) + 20;
        if(tempWidth > 400){
            tempWidth = 400;
        }
        this.imageStyleMobile.width = tempWidth.toString() + '%';
        
        console.log(this.imageStyleMobile.width);
        // this.imageStyleMobile.width = '300%';
    }

    decreaseSizeMobile(): any{
        let tempstr = '';
        for(let i=0; i<this.imageStyleMobile.width.length; i++){
            if(this.imageStyleMobile.width[i] == '%'){
                break;
            }
            else{
                tempstr = tempstr + this.imageStyleMobile.width[i];
            }
        }
        let tempWidth = Number(tempstr) - 20;
        if(tempWidth < 100){
            tempWidth = 100;
        }
        this.imageStyleMobile.width = tempWidth.toString() + '%';
    }
    

    removeImage(index: any):any{
        if(this.data.homeworkImages.length == 1){
            this.dialogRef.close();
        }
        if(index == this.data.homeworkImages.length-1){
            this.counter = this.counter - 1;
        }
        this.data.homeworkImages.splice(index, 1);
        this.moveToIndex = this.counter;
    }   

    moveImage(){
        let temp = this.data.homeworkImages[this.counter];
        this.data.homeworkImages.splice(this.counter, 1);
        this.data.homeworkImages.splice(this.moveToIndex, 0, temp);
        this.counter = this.moveToIndex;
        this.imageStyle.width = '50%';
        this.imageStyleMobile.width = '100%';
    }


    onNext() {
        if (this.counter != this.data.homeworkImages.length - 1) {
            this.counter++;
        }
        else{
            return ;
        }
        this.moveToIndex = this.counter;
        this.imageStyle.width = '50%';
        this.imageStyleMobile.width = '100%';
    }

    onPrevious() {
        if (this.counter > 0) {
            this.counter--;
        }
        else{
            return ;
        }
        this.moveToIndex = this.counter;
        this.imageStyle.width = '50%';
        this.imageStyleMobile.width = '100%';
    }

    func(str: any):any{
        let tempStr: string;
        if(str.questionImage != undefined){
            tempStr = str.questionImage;
        }
        else{
            tempStr = str.answerImage;
        }
        showPhoto(tempStr)
    }

    
}