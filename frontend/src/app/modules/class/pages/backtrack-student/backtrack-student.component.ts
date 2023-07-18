import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommonFunctions } from '@classes/common-functions';
import { DataStorage } from '@classes/data-storage';
import { GenericService } from '@services/generic/generic-service';
import { BacktrackStudentServiceAdapter } from './backtrack-student.service.adapter';
import { BacktrackStudentHtmlAdapter } from './backtrack-student.html.adapter';
import { Student, Session, StudentAndStudentSectionJoined } from './backtrack-student.models';

@Component({
    selector: 'app-backtrack-student',
    templateUrl: './backtrack-student.component.html',
    styleUrls: ['./backtrack-student.component.css'],
    providers: [GenericService]
})

export class BacktrackStudentComponent implements OnInit {

    user;

    // Start :- class list
    classList: {
        id: number,
        name: string,
        orderNumber: number
    }[] = [];
    // End :- class list

    // Start :- section list
    sectionList: {
        id: number,
        name: string,
        orderNumber: number
    }[] = [];
    // End :- section list

    // Start :- session list
    sessionList: Session[] = [];
    // End :- session list

    // Start :- Frontend Student List with all session information
    studentList: Student[] = [];
    // End :- Frontend Student List with all session information

    // Start :- contains those class and sections for which students exist in this session
    classSectionList: {
        class: {
            id: number,
            name: string,
            orderNumber: number
        },
        section: {
            id: number,
            name: string,
            orderNumber: number
        }
    }[] = [];
    // End :- contains those class and sections for which students exist in this session

    htmlAdapter: BacktrackStudentHtmlAdapter;
    serviceAdapter: BacktrackStudentServiceAdapter;

    isLoading = false;

    constructor(
        public genericService: GenericService,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlAdapter = new BacktrackStudentHtmlAdapter(this.dialog);
        this.htmlAdapter.initialize(this);

        this.serviceAdapter = new BacktrackStudentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    // START: check if the page is opened on mobile viewport
    isMobileMenu(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }
    // END: check if the page is opened on mobile viewport

}