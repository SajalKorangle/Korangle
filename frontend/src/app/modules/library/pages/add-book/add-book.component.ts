import { Component, OnInit } from '@angular/core';
import { Book } from '@services/modules/library/models/book';
import { DataStorage } from "@classes/data-storage";
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'add-book',
    templateUrl: './add-book.component.html',
    styleUrls: ['./add-book.component.css'],
    providers: [ ],
})

export class AddBookComponent implements OnInit {
    printedCost = new FormControl('', [Validators.min(0)]);
    bookNumber = new FormControl('', [Validators.min(0), Validators.required]);
    numberOfPages = new FormControl('', [Validators.min(0)]);
    bookName = new FormControl('', [Validators.required]);

    user: any;
    frontImage: any;
    backImage: any;

    newBook: Book = new Book();


    isLoading = false;

    constructor () { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

    informWIP() {
        alert("Under construction");
    }

    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    async onImageSelect(evt: any, side: any) {
        let image = evt.target.files[0];

        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            alert('Image type should be either jpg, jpeg, or png');
            return;
        }

        if (image.size === 0) {
            alert('Image is blank. Please upload/select another image');
            return;
        }

        image = await this.cropImage(image, [1, 1]);

        while (image.size > 512000) {
            image = await this.resizeImage(image);
        }

        if (image.size > 512000) {
            alert('Image size should be less than 512kb');
            return;
        }


        const reader = new FileReader();
        reader.onload = (e) => {
            // this.profileImage = reader.result;
            if (side === 'back') {
                this.backImage = reader.result;
            } else if (side === 'front') {
                this.frontImage = reader.result;
            }
        };
        reader.readAsDataURL(image);
    }

    cropImage(file: File, aspectRatio: any): Promise<Blob> {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                let dx = 0;
                let dy = 0;
                let dw = image.width;
                let dh = image.height;

                let sx = 0;
                let sy = 0;
                let sw = dw;
                let sh = dh;

                if (sw > (aspectRatio[1] * sh) / aspectRatio[0]) {
                    sx = (sw - (aspectRatio[1] * sh) / aspectRatio[0]) / 2;
                    sw = (aspectRatio[1] * sh) / aspectRatio[0];
                    dw = sw;
                } else if (sh > (aspectRatio[0] * sw) / aspectRatio[1]) {
                    sy = (sh - (aspectRatio[0] * sw) / aspectRatio[1]) / 2;
                    sh = (aspectRatio[0] * sw) / aspectRatio[1];
                    dh = sh;
                }

                let canvas = document.createElement('canvas');
                canvas.width = dw;
                canvas.height = dh;

                let context = canvas.getContext('2d');

                context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

                canvas.toBlob(resolve, file.type);
            };
            image.onerror = reject;
        });
    }

    resizeImage(file: File): Promise<Blob> {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                let maxWidth = image.width / 2;
                let maxHeight = image.height / 2;

                // if (width <= maxWidth && height <= maxHeight) {
                //     resolve(file);
                // }

                let newWidth;
                let newHeight;

                if (width > height) {
                    newHeight = height * (maxWidth / width);
                    newWidth = maxWidth;
                } else {
                    newWidth = width * (maxHeight / height);
                    newHeight = maxHeight;
                }

                let canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;

                let context = canvas.getContext('2d');

                context.drawImage(image, 0, 0, newWidth, newHeight);

                canvas.toBlob(resolve, file.type);
            };
            image.onerror = reject;
        });
    }

}
