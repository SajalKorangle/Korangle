import { Component, OnInit } from '@angular/core';
import { GenericService } from '@services/generic/generic-service';
import { DataStorage } from "@classes/data-storage";
import { IssueDepositBookServiceAdapter } from './issue-deposit-book.service-adapter';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';


@Component({
    selector: 'app-issue-deposit-book',
    templateUrl: './issue-deposit-book.component.html',
    styleUrls: ['./issue-deposit-book.component.css'],
    providers: [GenericService]
})
export class IssueDepositBookComponent implements OnInit {
    user: any;
    serviceAdapter: IssueDepositBookServiceAdapter;

    isLoading: Boolean = false;
    isStudentListLoading: Boolean = false;

    issueTo: 'student' | 'employee' = null;

    issueLimits = {
        student: 0,
        employee: 0
    };

    booksList: any = null;

    selectedStudent: any = null;
    selectedStudentSection: any;

    selectedEmployee: any = null;
    employeeList: any = null;

    isIssuedBooksLoading: Boolean = false;
    issuedBooksList: any = [];

    issueBookNumber: any = null;

    filteredBookList: any = [];

    selectedBook: any = null;
    selectedBookFormControl: FormControl = new FormControl();


    constructor(
        public genericService: GenericService,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new IssueDepositBookServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);

        this.filteredBookList = this.selectedBookFormControl.valueChanges.pipe(
            map((value) => (typeof value === 'string' ? value : (value as any).bookNumber)),
            map((bookNumber) => this.filterBooksList(bookNumber))
        );
    }

    reset() {
        this.selectedStudent = null;
        this.selectedEmployee = null;
        this.issuedBooksList = null;
        this.issueBookNumber = null;
        this.selectedBook = null;
        this.selectedBookFormControl.setValue(null);
    }

    handleIssueToFieldSelect($event) {
        this.reset();
        this.employeeList = null;
    }

    handleStudentListSelection(value): void {
        this.reset();
        this.selectedStudent = value[0][0];
        this.selectedStudentSection = value[1][0];
        this.serviceAdapter.getIssuedBooksList();
    }

    handleEmployeeListSelection(value): void {
        this.reset();
        this.selectedEmployee = value;
        this.serviceAdapter.getIssuedBooksList();
    }

    handleDeposit(record) {
        this.serviceAdapter.depositBook(record);
    }

    handleIssue() {
        this.serviceAdapter.issueBook(this.selectedBook);
    }

    filterBooksList(value: string) {
        if (value === null || value === '' || typeof value !== 'string') {
            return [];
        }

        value = value.trim();

        return this.booksList.filter((book) => {
            return (
                book.name.toLowerCase().indexOf(value.toLowerCase()) != -1 ||
                (book.bookNumber && book.bookNumber.toString().toLowerCase().indexOf(value.toLowerCase()) != -1)
            );
        })
            .sort((a, b) => {
                if (getBookIndex(a) == getBookIndex(b)) {
                    return 0;
                } else if (getBookIndex(a) > getBookIndex(b)) {
                    return 1;
                } else {
                    return -1;
                }
            })
            .slice(0, 20);

        function getBookIndex(book: any): number {
            let index = 100000;
            let nameIndex = book.name.toLowerCase().indexOf(value.toLowerCase());
            let bookNumberIndex = book.bookNumber ? book.bookNumber.toString().toLowerCase().indexOf(value.toLowerCase()) : -1;
            index = (nameIndex != -1 && nameIndex < index) ? nameIndex : index;
            index = (bookNumberIndex != -1 && bookNumberIndex < index) ? bookNumberIndex : index;
            return index;
        }
    }

    displayBook(book) {
        return book ? (typeof book == 'string' ? book : book.name + ' (' + book.bookNumber + ')') : '';
    }

    leftText(name: any): any {
        let text = (<HTMLInputElement>document.getElementById("bookInput")).value;
        let ind = name.toLowerCase().indexOf(text.toLowerCase());
        if (ind == -1)
            return name;
        if (ind > 0)
            return name.substring(0, ind);
        return '';
    }

    rightText(name: any): any {
        let text = (<HTMLInputElement>document.getElementById("bookInput")).value;
        let ind = name.toLowerCase().indexOf(text.toLowerCase());
        if (ind == -1)
            return '';
        let right = ind + text.length;
        if (right < name.length)
            return name.substring(right, name.length);
        return '';
    }

    highlightText(name: any): any {
        let text = (<HTMLInputElement>document.getElementById("bookInput")).value;
        let ind = name.toLowerCase().indexOf(text.toLowerCase());
        if (ind != -1)
            return name.substring(ind, ind + text.length);
        return '';
    }

    hasReachedIssueLimit() {
        return this.issuedBooksList.length >= this.issueLimits[this.issueTo];
    }

    isBookBlocked(book: any) {
        if (this.issueTo == 'student') return !book.canStudentIssue;
        return !book.canEmployeeIssue;
    }
}
