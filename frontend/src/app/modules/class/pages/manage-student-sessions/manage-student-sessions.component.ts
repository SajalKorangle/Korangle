import { Component, OnInit } from '@angular/core';
import { GenericService } from '@services/generic/generic-service';
import { DataStorage } from '@classes/data-storage';
import { CommonFunctions } from '@classes/common-functions';
import { ManageStudentSessionsServiceAdapter } from './manage-student-sessions.service.adapter';
import { ManageStudentSessionsDynamicValues } from './manage-student-sessions.dynamic.values';
import { ManageStudentSessionsHtmlAdapter } from './manage-student-sessions.html.adapter';

@Component({
    selector: 'app-manage-student-sessions',
    templateUrl: './manage-student-sessions.component.html',
    styleUrls: ['./manage-student-sessions.component.css'],
    providers: [GenericService]
})
export class ManageStudentSessionsComponent implements OnInit {
    user;

    serviceAdapter: ManageStudentSessionsServiceAdapter;
    htmlAdapter: ManageStudentSessionsHtmlAdapter;
    dynamicValues: ManageStudentSessionsDynamicValues;

    // contains the lists of all the classes, sections and sessions respectively
    classList: any = [];
    sectionList: any = [];
    sessionList: any = [];

    // stores the details of each of the sessions associated with the selected student
    studentSessionList: {
        hasFeeReceiptOrDiscount: boolean,
        id?: number,
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
    discountList: any = [];

    // student session list matching with backend
    backendStudentSessionList: {
        id: number;
        parentClass: number;
        parentDivision: number;
        parentSession: number;
    }[] = [];

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

        if (this.isMobileMenu()) {
            return;
        }

        this.dynamicValues = new ManageStudentSessionsDynamicValues();
        this.dynamicValues.initializeAdapter(this);

        this.htmlAdapter = new ManageStudentSessionsHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);

        this.serviceAdapter = new ManageStudentSessionsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
    }
    // END: ngOnInit

    // START: check if the website is opened on mobile viewport
    isMobileMenu() {
        return CommonFunctions.getInstance().isMobileMenu();
    }
    // END: check if the website is opened on mobile viewport

}