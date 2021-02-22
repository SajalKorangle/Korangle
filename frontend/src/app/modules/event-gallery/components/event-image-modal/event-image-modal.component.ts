import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { showPhoto } from '@classes/common.js';

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
    eventImages: any;
    index: any;
    editable: any;
    isMobile: any;
}


@Component({
    selector: 'event-image-modal',
    templateUrl: 'event-image-modal.html',
    styleUrls: ['./event-image-modal.css'],
    animations: [
        trigger('animImageSlider', [
          transition(':increment', right),
          transition(':decrement', left),
        ]),
    ]
})

export class EventImageModalComponent {
    
    constructor(
        public dialogRef: MatDialogRef<EventImageModalComponent>,
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
        'opacity': '1',
    }

    imageStyleMobile = {
        'display': 'inline-block',
        'margin': 'auto',
        'width': '95vw',
        'max-width': '100%',
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    
    removeImage(index: any):any{
        if(this.data.eventImages.length == 1){
            this.dialogRef.close();
        }
        if(index == this.data.eventImages.length-1){
            this.counter = this.counter - 1;
        }
        this.data.eventImages.splice(index, 1);
        this.moveToIndex = this.counter;
    }   

    moveImage(){
        let temp = this.data.eventImages[this.counter];
        this.data.eventImages.splice(this.counter, 1);
        this.data.eventImages.splice(this.moveToIndex, 0, temp);
        this.counter = this.moveToIndex;
        this.imageStyle.width = '50%';
        this.imageStyleMobile.width = '100%';
    }


    onNext() {
        if (this.counter != this.data.eventImages.length - 1) {
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

    showImageInGallery(str: any):any{
        let tempStr: string;
        if(str.eventImage != undefined){
            tempStr = str.eventImage;
        }
        showPhoto(tempStr)
    }

    changeImageSize(event: any){
        this.imageStyle.width = event.value.toString() + '%';
    }
    
}