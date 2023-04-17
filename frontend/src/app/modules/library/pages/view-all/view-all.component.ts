import { Component, OnInit } from '@angular/core';
import { ViewAllHtmlRenderer } from './view-all.html.renderer';
import { DataStorage } from "@classes/data-storage";
import { GenericService } from '@services/generic/generic-service';
import { ViewAllServiceAdapter } from './view-all.service.adapter';


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

    }
    initializeBookList(bookFullProfileList): void {
        this.bookFullProfileList = bookFullProfileList;
        this.handleBookDisplay();
    }

    handleBookDisplay(): void {
        let serialNumber = 0;
        this.bookFullProfileList.forEach(book => {
            book.show = true;
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
        list.sort(this.SortComparator);
        return list;
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

    printBookList(): void {
        alert("Under construction");
    }
    downloadList(): void {
        alert("Under construction");
    }

}
