import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
        public data: {
            [key: string]: any,
         })  {
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
    };

    imageStyleMobile = {
        'display': 'inline-block',
        'margin': 'auto',
        'width': '95vw',
        'max-width': '100%',
    };

    onNoClick(): void {
        this.dialogRef.close();
    }

    removeImage(index: any): any {
        if (this.data.images.length == 1) {
            this.dialogRef.close();
        }
        if (index == this.data.images.length - 1) {
            this.counter = this.counter - 1;
        }
        this.data.images.splice(index, 1);
        this.moveToIndex = this.counter;
    }

    moveImage() {
        let temp = this.data.images[this.counter];
        this.data.images.splice(this.counter, 1);
        this.data.images.splice(this.moveToIndex, 0, temp);
        this.counter = this.moveToIndex;
        this.imageStyle.width = '50%';
        this.imageStyleMobile.width = '100%';
    }


    onNext() {
        if (this.counter != this.data.images.length - 1) {
            this.counter++;
        }
        else {
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
        else {
            return ;
        }
        this.moveToIndex = this.counter;
        this.imageStyle.width = '50%';
        this.imageStyleMobile.width = '100%';
    }

    showImageInGallery(str: any): any {
        let tempStr: string;
        if (str.imageUrl != undefined) {
            tempStr = str.imageUrl;
        }
        else {
            tempStr = str.imageUrl;
        }
        // showPhoto(tempStr)
    }

    changeImageSize(event: any) {
        this.imageStyle.width = event.value.toString() + '%';
    }

}