import { Component, OnInit } from '@angular/core';
import { ViewAllHtmlRenderer } from './view-all.html.renderer';
import { DataStorage } from "@classes/data-storage";
import { GenericService } from '@services/generic/generic-service';
import { ViewAllServiceAdapter } from './view-all.service.adapter';
import { ExcelService } from '../../../../excel/excel-service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_BOOK_LIST } from '../../../../print/print-routes.constants';

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
    providers: [
        GenericService,
        ExcelService
    ],
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
    displayedBooks = [];

    displayBookNumber;

    selectedAuthors = [];
    selectedPublishers = [];
    selectedBookTypes = [];
    searchBookName = '';

    NONE_FILTER_SELECTION = '';

    sortBy = 'name';
    sortOrder = 1; // 1 => ASC, -1 => DESC

    // Lists of all unique authors, publishers and bookTypes that can be selected when filtering
    authorOptions = new Set();
    publisherOptions = new Set();
    bookTypeOptions = new Set();

    constructor (
        public genericService: GenericService,
        public excelService: ExcelService,
        public printService: PrintService,
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

    handleBookDisplay(): void {
        let filteredList = this.filterBooks();
        let sortedFilteredList = this.sortBooks(filteredList);
        this.displayedBooks = sortedFilteredList.map((book, i) => ({...book, serialNumber: i + 1}))
    }

    initializeBookList(bookFullProfileList): void {
        this.bookFullProfileList = bookFullProfileList.map(book => ({
            ...book,
            printedCost: book.printedCost !== null ? parseFloat(book.printedCost) : null,
            show: true
        }));

        this.handleBookDisplay();
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

        this.handleBookDisplay();
    }

    sortBooks(books) : any {
        let sortedList = books.sort(this.SortComparator)
        return sortedList;
    }
    /* --------------------------- Sorting logic ends --------------------------- */
    /* ------------------------- Filtering logic starts ------------------------- */

    // If a filter is completely empty, consider it disabled and do not filter by it
    filterBooks(): any{
        let booksDisplayed = 0;

        // Filter by menu selections
        let filteredList = this.bookFullProfileList.filter(book => {
            const author = book.author || '';
            const publisher = book.publisher || '';
            const type = book.typeOfBook || '';

            const disableAuthorsFilter = this.selectedAuthors.length === 0;
            const disablePublishersFilter = this.selectedPublishers.length === 0;
            const disableBookTypesFilter = this.selectedBookTypes.length === 0;

            const authorValid = disableAuthorsFilter || this.selectedAuthors.includes(author.toLowerCase());
            const publisherValid =  disablePublishersFilter || this.selectedPublishers.includes(publisher.toLowerCase());
            const bookTypeValid = disableBookTypesFilter || this.selectedBookTypes.includes(type.toLowerCase());

            const nameMatchesSearch = (book.name.toLowerCase().indexOf(this.searchBookName.toLowerCase()) > -1);

            book.show = (authorValid && publisherValid && bookTypeValid && nameMatchesSearch);

            if (book.show) {
                booksDisplayed++;
                return true;
            }
            return false;
        });

        this.displayBookNumber = booksDisplayed;

        return filteredList;
    }

    unSelectAllOptions(filter): void {
        this[filter] = [];
        this.handleBookDisplay();
    }
    /* -------------------------- Filtering logic ends -------------------------- */

    getHeaderValues(): any {
        const headerValues = [];
        this.columnFilter.showSerialNumber ? headerValues.push('Serial No.') : '';
        this.columnFilter.showBookNumber ? headerValues.push('Book No.') : '';
        this.columnFilter.showName ? headerValues.push('Name') : '';
        this.columnFilter.showAuthor ? headerValues.push('Author') : '';
        this.columnFilter.showLocation ? headerValues.push('Location') : '';
        this.columnFilter.showDateOfPurchase ? headerValues.push('Date of Purchase') : '';
        this.columnFilter.showPublisher ? headerValues.push('Publisher') : '';
        this.columnFilter.showEdition ? headerValues.push('Edition') : '';
        this.columnFilter.showNumberOfPages ? headerValues.push('No. of pages') : '';
        this.columnFilter.showPrintedCost ? headerValues.push('Printed Cost') : '';
        this.columnFilter.showCoverType ? headerValues.push('Cover Type') : '';
        this.columnFilter.showBookType ? headerValues.push('Book Type') : '';

        return headerValues;
    }

    getBookDisplayInfo(book) : any {
        let bookDisplay = [];
        this.columnFilter.showSerialNumber ? bookDisplay.push(book.serialNumber) : '';
        this.columnFilter.showBookNumber ? bookDisplay.push(book.bookNumber) : '';
        this.columnFilter.showName ? bookDisplay.push(book.name) : '';
        this.columnFilter.showAuthor ? bookDisplay.push(book.author) : '';
        this.columnFilter.showLocation ? bookDisplay.push(book.location) : '';
        this.columnFilter.showDateOfPurchase ? bookDisplay.push(book.dateOfPurchase) : '';
        this.columnFilter.showPublisher ? bookDisplay.push(book.publisher) : '';
        this.columnFilter.showEdition ? bookDisplay.push(book.edition) : '';
        this.columnFilter.showNumberOfPages ? bookDisplay.push(book.numberOfPages) : '';
        this.columnFilter.showPrintedCost ? bookDisplay.push(book.printedCost) : '';
        this.columnFilter.showCoverType ? bookDisplay.push(book.coverType) : '';
        this.columnFilter.showBookType ? bookDisplay.push(book.typeOfBook) : '';

        return bookDisplay;
    }

    printBookList(): void {
        const value = {
            bookList: this.displayedBooks,
            columnFilter: this.columnFilter,
        };
        this.printService.navigateToPrintRoute(PRINT_BOOK_LIST, { user: this.user, value });
    }
    downloadList(): void {
        let template = [this.getHeaderValues()];
        this.displayedBooks.forEach(book => template.push(this.getBookDisplayInfo(book)));
        this.excelService.downloadFile(template, 'korangle_books.csv');
    }

}