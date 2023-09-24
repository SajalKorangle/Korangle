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

    booksList: any = null;

    selectedStudent: any = null;
    selectedStudentSection: any;

    selectedEmployee: any = null;

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
    }

    handleStudentListSelection(value): void {
        this.selectedStudent = value[0][0];
        this.selectedStudentSection = value[1][0];
        this.serviceAdapter.getIssuedBooksList();
    }

    handleEmployeeListSelection(value): void {
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
        return this.booksList.filter((book) => {
            if (book.bookNumber.toString().startsWith(value)) return true;
            return false;
        });
    }

    displayBook(book) {
        return book ? (typeof book == 'string' ? book : book.name + ' (' + book.bookNumber + ')') : '';
    }
}
