import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { showPhoto } from '@classes/common.js';
import { saveAs } from 'file-saver';

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
    imageList: any;
    index: any;
    extraList: any;
    type: any;
    //type 1 = No download option , Zooming possible Eg:in Manage Event Page
    //type 2 = No Zooming option , download possible Eg:in View Event Page
    fileType: any;
    file: any;
    //type 'image' or type 'pdf'
    isMobile: any;
}

@Component({
    selector: 'view-image-modal',
    templateUrl: 'view-image-modal.html',
    styleUrls: ['./view-image-modal.css'],
    animations: [trigger('animImageSlider', [transition(':increment', right), transition(':decrement', left)])],
})
export class ViewImageModalComponent {
    constructor(
        public dialogRef: MatDialogRef<ViewImageModalComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: ImagePreviewDialogData
    ) {
        this.moveToIndex = this.data.index;
        this.counter = this.data.index;
    }

    moveToIndex: any;
    counter: number = 0;

    imageStyle = {
        display: 'inline-block',
        margin: 'auto',
        width: '50%',
        opacity: '1',
    };

    imageStyleMobile = {
        display: 'inline-block',
        margin: 'auto',
        width: '95vw',
        'max-width': '100%',
    };
    isImageDownloading: boolean;

    onNoClick(): void {
        this.dialogRef.close();
    }

    moveImage() {
        let temp = this.data.imageList[this.counter];
        this.data.imageList.splice(this.counter, 1);
        this.data.imageList.splice(this.moveToIndex, 0, temp);
        this.counter = this.moveToIndex;
        this.imageStyle.width = '50%';
        this.imageStyleMobile.width = '100%';
    }

    onNext() {
        if (this.counter != this.data.imageList.length - 1) {
            this.counter++;
        } else {
            return;
        }
        this.moveToIndex = this.counter;
        this.imageStyle.width = '50%';
        this.imageStyleMobile.width = '100%';
    }

    onPrevious() {
        if (this.counter > 0) {
            this.counter--;
        } else {
            return;
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
        showPhoto(tempStr);
    }

    changeImageSize(event: any) {
        this.imageStyle.width = event.value.toString() + '%';
    }

    getCorrespondingTags() {
        return this.data.extraList.filter((tags) => this.data.imageList[this.counter].tagList.some((tag) => tag == tags.id));
    }

    async downloadSelectedImages() {
        this.isImageDownloading = true;
        let image: any;
        let type = this.data.imageList[this.counter].imageUrl.split('.');
        type = type[type.length - 1];
        image = await this.toDataURL(this.data.imageList[this.counter].imageUrl);
        saveAs(image, 'Event_Image.' + type);
        this.isImageDownloading = false;
    }

    async toDataURL(url) {
        const response = await fetch(url + '?js=');
        if (response.status == 403) {
            alert('Download Failed');
        } else {
            const reader = response.body.getReader();
            const contentLength = response.headers.get('Content-Length');
            let receivedLength = 0;
            let chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                chunks.push(value);
                receivedLength += value.length;
                console.log(`Received ${receivedLength} of ${contentLength}`);
            }
            return new Blob(chunks);
        }
    }
}
