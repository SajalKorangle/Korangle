import { Component, OnInit } from '@angular/core';
import { GenericService } from '@services/generic/generic-service';
import { DataStorage } from '@classes/data-storage';
import { CommonFunctions } from '@classes/common-functions';
import { ManageStudentSessionsServiceAdapter } from './manage-student-sessions.service.adapter';

@Component({
    selector: 'app-manage-student-sessions',
    templateUrl: './manage-student-sessions.component.html',
    styleUrls: ['./manage-student-sessions.component.css'],
    providers: [GenericService]
})

export class ManageStudentSessionsComponent implements OnInit {
    user;
  
    serviceAdapter: ManageStudentSessionsServiceAdapter;
  
    // contains the lists of all the classes, sections and sessions respectively
    classList: any = [];
    sectionList: any = [];
    sessionList: any = [];
  
    // stores the details of each of the sessions associated with the selected student
    studentSessionList: {
        hasFeeReceipt: boolean,
        id?: number,
        isNewSession: boolean,
        parentClass: {
            id?: number,
            name: string,
            orderNumber: number
        },
        parentDivision: {
            id?: number,
            name: string,
            orderNumber: number
        },
        parentSession: {
            endDate: Date,
            id?: number,
            name: string,
            orderNumber: number,
            startDate: Date
        }
    }[] = [];
  
    // contains the details of fee receipt for the selected student
    feeReceiptList: any = [];
  
    // stores the student selected in parent student filter
    selectedStudent: any;
  
    isLoading = false;
    isStudentListLoading = false;
  
    constructor(
        public genericService: GenericService
    ) { }

    // START: ngOnInit
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        if(this.isMobileMenu()) {
            return;
        }

        this.serviceAdapter = new ManageStudentSessionsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
    }
    // END: ngOnInit

    // START: handle selection on student list from parent-student-filter
    handleStudentListSelection(studentDetailsList: any): void {
        this.selectedStudent = studentDetailsList[0][0];
        this.serviceAdapter.initializeData();
    }
    // END: handle selection on student list from parent-student-filter

    // START: handle the changing of classes for all the lower sessions if class is changed for a session
    handleClassChange(idx): void {
        let currClassIdx = this.classList.findIndex((classObj) => classObj.id == this.studentSessionList[idx].parentClass.id);
        for(let i = idx + 1; i < this.studentSessionList.length; i++) {
            if(this.studentSessionList[i].hasFeeReceipt == false) {
                let nextClass = currClassIdx+1 < this.classList.length ? this.classList[currClassIdx + 1] : this.classList[currClassIdx];
                this.studentSessionList[i].parentClass = nextClass;
                currClassIdx++;
            } else {
                break;
            }
        }
    }
    // END: handle the changing of classes for all the lower sessions if class is changed for a session

    // START: handle the changing of divisions for all the lower sessions if division is changed for a session
    handleDivisionChange(idx): void {
        let currDivisionIdx = this.sectionList.findIndex((sectionObj) => sectionObj.id == this.studentSessionList[idx].parentDivision.id);
            for(let i = idx + 1; i < this.studentSessionList.length; i++) {
            if(this.studentSessionList[i].hasFeeReceipt == false) {
                this.studentSessionList[i].parentDivision = this.sectionList[currDivisionIdx];
            } else {
                break;
            }
        }
    }
    // END: handle the changing of divisions for all the lower sessions if division is changed for a session

    // START: handle if a session is removed from the list
    removeSession() {
        if(this.studentSessionList.length > 0) {
            let lastSession = this.studentSessionList[this.studentSessionList.length - 1];
            if(lastSession.hasFeeReceipt == false) {
                this.studentSessionList.pop();
            }
        }
    }
    // END: handle if a session is removed from the list

    // START: check if the new session button should appear
    enableNewSessionButton(): boolean {
        // add conditions to check if the new session button should be enabled
        if(this.studentSessionList.length == 0)
            return true;

        let lastStudentSession = this.studentSessionList[this.studentSessionList.length - 1];
        let firstSession = this.sessionList[0];
        return lastStudentSession.parentSession.id > firstSession.id;
    }
    // END: check if the new session button should appear

    // START: add new session when new session button is clicked
    addStudentSession(): void {
        let newSession = this.sessionList[this.sessionList.length - 1];
        if(this.studentSessionList.length == 0) {
            this.studentSessionList.push({
                parentSession: newSession,
                parentClass: this.classList[0],
                parentDivision: this.sectionList[0],
                isNewSession: true,
                hasFeeReceipt: false
            });
        } else {
            let lastSession = this.studentSessionList[this.studentSessionList.length - 1];
            let lastSessionIdx = this.sessionList.findIndex((sessionObj) => sessionObj.id == lastSession.parentSession.id);
            let lastClassIdx = this.classList.findIndex((classObj) => classObj.id == lastSession.parentClass.id);
            let lastDivisionIdx = this.sectionList.findIndex((divisionObj) => divisionObj.id == lastSession.parentDivision.id);
            this.studentSessionList.push({
                parentSession: this.sessionList[lastSessionIdx-1],
                parentClass: lastClassIdx + 1 < this.classList.length ? this.classList[lastClassIdx + 1]: this.classList[lastClassIdx],
                parentDivision: this.sectionList[lastDivisionIdx],
                isNewSession: true,
                hasFeeReceipt: false
            });
        }
    }
    // END: add new session when new session button is clicked

    // START: save the changes made to the data
    saveStudentSessions() {
        this.serviceAdapter.saveSessions();
    }
    // END: save the changes made to the data

    // START: check if the website is opened on mobile viewport
    isMobileMenu() {
        return CommonFunctions.getInstance().isMobileMenu();
    }
    // END: check if the website is opened on mobile viewport

    showUpdateButton() {
        return true;
    }

}