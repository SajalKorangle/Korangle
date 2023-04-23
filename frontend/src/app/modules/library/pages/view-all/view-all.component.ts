import { Component, OnInit } from '@angular/core';
import { ViewAllHtmlRenderer } from './view-all.html.renderer';
import { DataStorage } from "@classes/data-storage";
import { GenericService } from '@services/generic/generic-service';
import { ViewAllServiceAdapter } from './view-all.service.adapter';
import { FormControl, FormGroup } from '@angular/forms';

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

    NONE_FILTER_SELECTION = '';

    sortBy = 'name';
    sortOrder = 1; // 1 => ASC, -1 => DESC

    // Lists of all unique authors, publishers and bookTypes that can be selected when filtering
    authorsSelected = new Set();
    publishersSelected = new Set();
    bookTypesSelected = new Set();

    // Filter menu form controls
    filterForm = new FormGroup({
        authors: new FormControl([]),
        publishers: new FormControl([]),
        bookTypes: new FormControl([]),
    });

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

        const initialValue = this.filterForm.value;
        this.filterForm.valueChanges.subscribe(value => {
            this.filterBooks();
        });
        this.filterForm.setValue(initialValue, { emitEvent: true });
    }

    initializeBookList(bookFullProfileList): void {
        this.bookFullProfileList = bookFullProfileList.map(book => ({
            ...book, 
            printedCost: book.printedCost !== null ? parseFloat(book.printedCost) : null
        }));
        this.handleBookDisplay();
    }

    handleBookDisplay(): void {
        let serialNumber = 0;
        this.bookFullProfileList.forEach(book => {
            book.show = true;
            book.serialNumber = ++serialNumber;
        });
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

    /* -------------------------- Sorting logic starts -------------------------- */
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
        list = list.filter(book => book.show);
        return list.sort(this.SortComparator).map((book, i) => ({
            ...book,
            serialNumber: i + 1
        }));
    }
    /* --------------------------- Sorting logic ends --------------------------- */
    /* ------------------------- Filtering logic starts ------------------------- */

    // If a filter is completely empty, consider it disabled and do not filter by it
    filterBooks(): void {
        let booksDisplayed = 0;
        this.bookFullProfileList.forEach(book => {
            const author = book.author || '';
            const publisher = book.publisher || '';
            const type = book.typeOfBook || '';

            const disableAuthorsFilter = this.filterForm.get('authors').value.length === 0;
            const disablePublishersFilter = this.filterForm.get('publishers').value.length === 0;
            const disableBookTypesFilter = this.filterForm.get('bookTypes').value.length === 0;


            const authorValid = disableAuthorsFilter ? true : this.filterForm.get('authors').value.includes(author.toLowerCase());
            const publisherValid =  disablePublishersFilter ? true : this.filterForm.get('publishers').value.includes(publisher.toLowerCase());
            const bookTypeValid = disableBookTypesFilter ? true : this.filterForm.get('bookTypes').value.includes(type.toLowerCase());

            book.show = (authorValid && publisherValid && bookTypeValid);
            if (book.show) booksDisplayed++;
        });
        this.displayBookNumber = booksDisplayed;
    }

    unSelectAllOptions(filter): void {
        this.filterForm.get(filter).setValue([]);
    }
    /* -------------------------- Filtering logic ends -------------------------- */
    printBookList(): void {
        alert("Under construction");
    }
    downloadList(): void {
        alert("Under construction");
    }

}
