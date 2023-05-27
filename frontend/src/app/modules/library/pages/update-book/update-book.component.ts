import { DataStorage } from "@classes/data-storage";
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Book } from '@modules/library/models/book';
import { UpdateBookServiceAdapter } from "./update-book.service.adapter";
import { GenericService } from '@services/generic/generic-service';

@Component({
    selector: 'update-book',
    templateUrl: './update-book.component.html',
    styleUrls: ['./update-book.component.css'],
    providers: [GenericService]
})
export class UpdateBookComponent implements OnInit {

    user: any;

    bookList = [];
    filteredBookList: Observable<Book[]>;

    searchBookFormControl: FormControl = new FormControl('');
    isLoading = false;

    serviceAdapter: UpdateBookServiceAdapter;

    selectedBook: Book | null = null;
    updatedBook: Book | null = null;

    backImage: any;
    frontImage: any;

    constructor(public genericService: GenericService) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new UpdateBookServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.filteredBookList = this.searchBookFormControl.valueChanges
        .pipe(
            startWith(''),
            map((value) => (typeof value === 'string' ? value : (value as any).name)),
            map(searchedBookName => this.getFilteredBookList(searchedBookName)),
        );
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

        const reader = new FileReader();
        reader.onload = (e) => {
            if (side === 'back') {
                this.backImage = reader.result;
            } else if (side === 'front') {
                this.frontImage = reader.result;
            }
        };
        reader.readAsDataURL(image);
    }

    getFilteredBookList(searchedBookName: string): Book[] {
        const list = this.bookList.filter(book => {
            return this.namesMatch(book.name, searchedBookName);
        });
        return list;
    }

    setBookListLoading(value: boolean): void {
        this.isLoading = value;
    }

    namesMatch(bookName: string, searchedBookName: string): boolean {
        if (searchedBookName === '') return false;
        bookName = bookName.toLowerCase();
        searchedBookName = searchedBookName.toLowerCase();
        return bookName.indexOf(searchedBookName) >= 0;
    }

    /* --------------- Matched book name highlighting logic starts -------------- */
    leftText(name: string): string {
        let text = this.searchBookFormControl.value;
        if (typeof text === typeof "abc") {   
            let ind = name.toLowerCase().indexOf(text.toLowerCase());
            if (ind == -1)
                return name;
            if (ind > 0)
                return name.substring(0, ind);
        }
        return '';
    }

    rightText(name: string): string {
        let text = this.searchBookFormControl.value;
        if (typeof text === typeof "abc") {
            let ind = name.toLowerCase().indexOf(text.toLowerCase());
            if (ind == -1)
                return '';
            let right = ind + text.length;
            if (right < name.length)
                return name.substring(right, name.length);
        }
        return '';
    }

    highlightText(name: string): string {
        let text = this.searchBookFormControl.value;
        if (typeof text === typeof "abc") {
            let ind = name.toLowerCase().indexOf(text.toLowerCase());
            if (ind != -1)
                return name.substring(ind, ind + text.length);
        }
        return '';
    }
    /* ---------------- Matched book name highlighting logic ends --------------- */


    handleBookSelection(event: any) {
        this.selectedBook = event.option.value;
        this.updatedBook = event.option.value;
        this.frontImage = this.updatedBook.frontImage;
        this.backImage = this.updatedBook.backImage;
    }

    displayFn(book) {
        return book ? book.name : undefined;
    }

    async updateBook() {
        console.log("update");
    }
}