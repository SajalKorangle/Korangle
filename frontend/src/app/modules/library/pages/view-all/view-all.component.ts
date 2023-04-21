import { Component, OnInit } from '@angular/core';
import { ViewAllHtmlRenderer } from './view-all.html.renderer';
import { DataStorage } from "@classes/data-storage";
import { GenericService } from '@services/generic/generic-service';
import { ViewAllServiceAdapter } from './view-all.service.adapter';

import { FormControl, FormGroup } from '@angular/forms';
import { pairwise } from 'rxjs/operators';



class ColumnFilter {
    showSerialNumber = true;
    showName = true;
    showAuthor = true;
    showPublisher = true;
    showDateOfPurchase = true;
    showBookNumber = true;
    showEdition = false;
    showNumberOfPages = false;
    showPrintedCost = false;
    showCoverType = false;
    showLocation = false;
    showBookType = false;
    showFrontImage = false;
    showBackImage = false;
}


@Component({
    selector: 'view-all',
    templateUrl: './view-all.component.html',
    styleUrls: ['./view-all.component.css'],
    providers: [ GenericService ],
})

export class ViewAllComponent implements OnInit {

    user: any;

    isLoading = false;

    showFilters = false;

    // Col Filter for books
    columnFilter: ColumnFilter;
    // Col Filter for documents
    documentFilter: ColumnFilter;

    serviceAdapter: ViewAllServiceAdapter;
    htmlRenderer: ViewAllHtmlRenderer;

    bookDocumentSelectList = ['Book', 'Documents'];
    currentBookDocumentFilter;

    bookFullProfileList = [];


    displayBookNumber = 0;
    searchBookName : string;

    sortBy = 'name';
    sortOrder = 1; // 1 => ASC, -1 => DESC

    // showAllBooks = true;

    // Filters
    authorsSelected = new Map();
    publishersSelected = new Map();
    bookTypesSelected = new Map();

    // Filter logic: any book can only be displayed if its author is in the authorsformctrllist
    //, pub is in the publishers fc list, typeofbook is .....
    // If forma  filter, no value is selected, consider it to be not in consideration (?)
    // NAH, works fine this way. 
    // just do it so that everything is ticked at the start
    filterForm = new FormGroup({
        authors: new FormControl(''),
        publishers: new FormControl(''),
        bookTypes: new FormControl(''),
    })

    setDefaultFilterSelections(): void {
        console.log(Array.from(this.authorsSelected.keys()));
        this.filterForm.get('authors').setValue(Array.from(this.authorsSelected.keys()));
        this.filterForm.get('publishers').setValue(Array.from(this.publishersSelected.keys()));
        this.filterForm.get('bookTypes').setValue(Array.from(this.bookTypesSelected.keys()));

        console.log("default: ");
        console.log(this.filterForm.value);
    }

    filterBooks(): void {
        this.bookFullProfileList.forEach(book => {
            const authorValid = book.author ? this.filterForm.get('authors').value.includes(book.author.toLowerCase()) : false;
            const publisherValid = book.publisher ? this.filterForm.get('publishers').value.includes(book.publisher.toLowerCase()) : false;
            const bookTypeValid = book.typeOfBook ? this.filterForm.get('bookTypes').value.includes(book.typeOfBook.toLowerCase()) : false;

            book.show = (authorValid && publisherValid && bookTypeValid);

            console.log({bookname: book.name, authorValid, publisherValid, bookTypeValid});
        })
    }

    constructor (
        public genericService: GenericService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();


        this.columnFilter = new ColumnFilter();
        this.documentFilter = new ColumnFilter();
        this.currentBookDocumentFilter = this.bookDocumentSelectList[0];

        this.serviceAdapter = new ViewAllServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new ViewAllHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);


        // get the initial value of the form control
        const initialValue = this.filterForm.value;

        this.filterForm.valueChanges
        .subscribe(value => {
            console.log(value);
            this.filterBooks();
        })

        // set the value of the form control and emit the initial value
        this.filterForm.setValue(initialValue, { emitEvent: true });

    }
 
    // todo: filter filteredBookList, not BookList
    filterBookList(column, option, isSelected): void {
        this.bookFullProfileList.forEach(book => {
            if ((book[column] || '').toLowerCase() === option){
                book.show = isSelected;
            }
        })
    }
    initializeBookList(bookFullProfileList): void {
        this.bookFullProfileList = bookFullProfileList;
        this.handleBookDisplay();
    }

    handleBookDisplay(): void {
        let serialNumber = 0;
        this.bookFullProfileList.forEach(book => {
            // book.show = true;
            book.show = false;

            book.serialNumber = ++serialNumber;
        });
    }

    SortComparator = (book1, book2) => {
        let a = book1[this.sortBy];
        let b = book2[this.sortBy];

        if (a === b) { return 0; }
        if (a === null) {
            return -1 * this.sortOrder;
        } else if (b === null) {
            return 1 * this.sortOrder;
        } else if (typeof a === 'string') {
            return a.localeCompare(b) * this.sortOrder;
        } else if (typeof a === 'number' || typeof a === 'boolean') {
            if (a < b) return -1 * this.sortOrder;
            if (a > b) return 1 * this.sortOrder;
        }
        return 0;
    }

    updateSortingParameters(sortparam) {
        if (this.sortBy === sortparam) {
            this.sortOrder = this.sortOrder * -1;
        } else this.sortOrder = 1;
        this.sortBy = sortparam;
    }

    getSortedBookList() : any {
        let list = [...this.bookFullProfileList];
        return list.sort(this.SortComparator).map((book, i) => ({
            ...book,
            serialNumber: i + 1
        }));
    }
    selectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = true;
        });
    }
    unSelectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = false;
        });
    }

    selectAuthorFilter(event, author): void {
        // console.log(event, author);
        this.authorsSelected.set(author.key, event.checked);
        this.filterBookList('author', author.key, event.checked);
    }

    printBookList(): void {
        alert("Under construction");
    }
    downloadList(): void {
        alert("Under construction");
    }

}
