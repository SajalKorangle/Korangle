import { Component, OnInit } from '@angular/core';
import { GenericService } from '@services/generic/generic-service';
import { Book } from '@modules/library/models/book';
import { DataStorage } from "@classes/data-storage";
import { AddBookServiceAdapter } from './add-book-service.adapter';
import { ViewChild } from '@angular/core';

@Component({
    selector: 'add-book',
    templateUrl: './add-book.component.html',
    styleUrls: ['./add-book.component.css'],
    providers: [ GenericService ],
})

export class AddBookComponent implements OnInit {
    user: any;
    frontImage: any;
    backImage: any;

    nullValue = null;

    newBook: Book;
    serviceAdapter: AddBookServiceAdapter;

    isLoading = false;

    @ViewChild('bookNumberField', {static: false}) bookNumberField;
    @ViewChild('pagesField', {static: false}) pagesField;
    @ViewChild('printedCostField', {static: false}) printedCostField;
    @ViewChild('bookNameField', {static: false}) bookNameField;




    constructor (
        public genericService: GenericService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new AddBookServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.initializeVariable();
    }

    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }
    initializeVariable(): void {
        this.newBook = new Book();
        this.newBook.parentSchool = this.user.activeSchool.dbId;

        this.frontImage = this.nullValue;
        this.backImage = this.nullValue;

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

    trimToTwoDecimalPlaces(value) {
        const withTwoDecimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
        return parseFloat(withTwoDecimals);
    }

    createNewBook(): void {
        if (this.newBook.name == null || this.newBook.name == '') {
            alert("Name should be populated");
            return;
        }
        if (this.newBook.bookNumber == null) {
            alert("Book No. should be populated");
            return;
        }
        if (this.bookNumberField.invalid || this.pagesField.invalid || this.printedCostField.invalid || this.bookNameField.invalid) {
            alert("Inputs are invalid");
            return;
        }
        if (this.newBook.printedCost != null) {
            this.newBook.printedCost = this.trimToTwoDecimalPlaces(this.newBook.printedCost);
        }

        this.serviceAdapter.createNewBook();
    }

}
