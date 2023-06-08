import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";
import { DeleteBookServiceAdapter } from './delete-book.service.adapter';
import { GenericService } from '@services/generic/generic-service';
import { Book } from '@modules/library/models/book';

class DeleteBookObject extends Book {
    selected: boolean = false;
    index: number = 0;
}

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
    selector: 'delete-book',
    templateUrl: './delete-book.component.html',
    styleUrls: ['./delete-book.component.css'],
    providers: [GenericService],
})


export class DeleteBookComponent implements OnInit {

    user: any;
    isLoading: boolean = false;

    serviceAdapter: DeleteBookServiceAdapter;

    completeBookList: DeleteBookObject[] = [];

    sortBy: string = "bookNumber";
    sortDirection: number = 1; // 1 for ascending, -1 for descending

    selectedAuthors = [];
    selectedPublishers = [];
    selectedBookTypes = [];
    searchBookName = '';

    columnFilter: ColumnFilter;

    NONE_FILTER_SELECTION = '';

    // Lists of all unique authors, publishers and bookTypes that can be selected when filtering
    authorOptions = new Set();
    publisherOptions = new Set();
    bookTypeOptions = new Set();

    constructor (public genericService: GenericService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new DeleteBookServiceAdapter();
        this.columnFilter = new ColumnFilter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
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

    // For sorting the books on the basis of the column clicked
    sortComparator = (book1, book2) => {
        let a = book1[this.sortBy];
        let b = book2[this.sortBy];

        if (a === b) { return 0; }
        if (a === null) {
            return -1 * this.sortDirection;
        } else if (b === null) {
            return 1 * this.sortDirection;
        } else if (typeof a === 'string') {
            return a.localeCompare(b) * this.sortDirection;
        } else if (typeof a === 'number' || typeof a === 'boolean') {
            if (a < b) return -1 * this.sortDirection;
            if (a > b) return 1 * this.sortDirection;
        }
        return 0;
    }

    filterBooks(): DeleteBookObject[] {
        const disableAuthorsFilter = this.selectedAuthors.length === 0;
        const disablePublishersFilter = this.selectedPublishers.length === 0;
        const disableBookTypesFilter = this.selectedBookTypes.length === 0;

        // Filter by menu selections
        return this.completeBookList.filter(book => {
            const author = book.author || '';
            const publisher = book.publisher || '';
            const type = book.typeOfBook || '';

            const authorValid = disableAuthorsFilter || this.selectedAuthors.includes(author.toLowerCase());
            const publisherValid =  disablePublishersFilter || this.selectedPublishers.includes(publisher.toLowerCase());
            const bookTypeValid = disableBookTypesFilter || this.selectedBookTypes.includes(type.toLowerCase());

            const nameMatchesSearch = book.name.toLowerCase().includes(this.searchBookName.toLowerCase());

            return (authorValid && publisherValid && bookTypeValid && nameMatchesSearch);

        }).sort(this.sortComparator).map((book, index) => { 
            book.index = index + 1;
            return book;
        });
    }

    selectAllBooks() {
        if (this.completeBookList.every(book => book.selected)) {
            this.completeBookList.forEach(book => book.selected = false);
        }
        else {
            this.completeBookList.forEach(book => book.selected = true);
        }
    }

    unSelectAllOptions(filter: string): void {
        this[filter] = [];
        this.filterBooks();
    }

    updateSortingParameters(sortingParameter: string) {
        this.sortBy = sortingParameter;
        this.sortDirection = this.sortDirection * -1;
    }

    getSelectedBooks(): DeleteBookObject[] {
        return this.completeBookList.filter(book => book.selected);
    }

    deleteSelectedBooks(): void {
        if (this.getSelectedBooks().length === 0) {
            alert("Please select at least one book to delete");
            return;
        }
        if (confirm("Are you sure you want to delete the selected books?")) {
            this.serviceAdapter.deleteBooks();
        }
    }
}
