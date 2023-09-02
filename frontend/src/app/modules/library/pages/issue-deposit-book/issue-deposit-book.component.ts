import { Component, OnInit } from '@angular/core';
import { GenericService } from '@services/generic/generic-service';
import { DataStorage } from "@classes/data-storage";
import { IssueDepositBookServiceAdapter } from './issue-deposit-book.service-adapter';


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

    classList: any;
    sectionList: any;

    selectedStudent: any = null;
    selectedStudentSection: any;

    selectedEmployee: any = null;

    isIssuedBooksLoading: Boolean = false;
    issuedBooksList: any = [];

    issueBookNumber: any = null;

    booksList: any = null;


    constructor(
        public genericService: GenericService,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new IssueDepositBookServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
    }

    reset() {
        this.selectedStudent = null;
        this.selectedEmployee = null;
        this.issuedBooksList = null;
        this.issueBookNumber = null;
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
        this.serviceAdapter.issueBook(this.issueBookNumber);
    } 
}
