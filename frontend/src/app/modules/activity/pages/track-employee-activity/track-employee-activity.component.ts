import { Component, OnInit } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';

import { GenericService } from '@services/generic/generic-service';
import { TrackEmployeeActivityServiceAdapter } from './track-employee-activity.service.adapter';

import { FilterModalComponent } from '@modules/activity/components/filter-modal/filter-modal.component';
import { TrackEmployeeActivityHtmlRenderer } from './track-employee-activity.html.renderer';

import { MatDialog } from '@angular/material';


@Component({
    selector: 'app-track-employee-activity',
    templateUrl: './track-employee-activity.component.html',
    styleUrls: ['./track-employee-activity.component.css'],
    providers: [GenericService],
})
export class TrackEmployeeActivityComponent implements OnInit {
    user;
    isLoading: boolean = false;

    activityRecordList = [];
    employeeList = [];
    taskList = [];

    startNumber: number = 0;    /* Starting Index of Records */
    endNumber: number = 0;    /* Ending Index of Records */
    numberOfRecordsPerPage: number = 10;    /* Records Per Page */
    totalRecords: number = 0;
    totalPages: number = 0;
    currentPage: number = 1;    /* Always >= 1 */

    timeSpanData = {};     /* dateFormat: "- None"  or  "StartDate to EndDate" */
    sortType = "";

    seachString = "";

    backgroundColorList = [];

    moduleColorList: any = ["#FBE0B7", "#C7E4CB", "#D7E0DF", "#FBCBCB"];
    colorIndex: number = 0;

    serviceAdapter: TrackEmployeeActivityServiceAdapter;
    htmlRenderer: TrackEmployeeActivityHtmlRenderer;

    constructor(
        public genericService: GenericService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new TrackEmployeeActivityServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.timeSpanData["dateFormat"] = "- None";

        this.htmlRenderer = new TrackEmployeeActivityHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    /* Initialize Employee List */
    initializeEmployeeList(employeeList: any): void {
        this.employeeList = [];

        employeeList.forEach((employee) => {
            let tempEmployee = {};
            tempEmployee["name"] = employee["name"];
            tempEmployee["dbId"] = employee["id"];
            tempEmployee["selected"] = false;
            this.employeeList.push(tempEmployee);
        });
    }  // Ends: initializeEmployeeList()

    /* Initialize Task List */
    initializeTaskList(): void {
        this.taskList = [];
        let moduleList = this.user.activeSchool.moduleList;

        moduleList.forEach((module) => {
            let tempTaskList = module.taskList;
            let bgColor = this.moduleColorList[this.colorIndex];
            this.colorIndex = ((this.colorIndex + 1) % this.moduleColorList.length);
            tempTaskList.forEach((task) => {
                let tempTask = {};
                tempTask["taskTitle"] = task["title"];
                tempTask["moduleTitle"] = module["title"];
                tempTask["taskDbId"] = task["dbId"];
                tempTask["moduleDbId"] = module["dbId"];
                tempTask["moduleIcon"] = module["icon"];
                tempTask["bgColor"] = bgColor;
                tempTask["selected"] = false;
                this.taskList.push(tempTask);
            });
        });
    }  // Ends: initializeTaskList()

    /* Initialize Total Records */
    initializeTotalRecords(employeeList: any) {
        this.totalRecords = 0;
        employeeList.forEach((employee) => {
            this.totalRecords += employee.record_count;
        });

        this.totalPages = Math.ceil(this.totalRecords / this.numberOfRecordsPerPage);
        this.endNumber = Math.min(this.numberOfRecordsPerPage, this.totalRecords);
        if (this.endNumber) {
            this.startNumber = 1;
        }
    }  // Ends: initializeTotalRecords()

    /* Records Based on Current Page */
    getActivityRecordList() {
        this.endNumber = Math.min(10 * this.currentPage, this.totalRecords);
        this.startNumber = Math.min(10 * (this.currentPage - 1) + 1, this.endNumber);    /* If totalRecords == 0, ==> startNumber = 0 & endNumber = 0 */
        this.serviceAdapter.getRecordsFromFilters();
    }  // Ends: getActivityRecordList()

    setCurrentPage(currentPage) {
        this.currentPage = currentPage;
        this.getActivityRecordList();
    }  // Ends: setCurrentPage()

    /* Go to Previous Page */
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.getActivityRecordList();
        }
    }  // Ends: previousPage()

    /* Go to Next Page */
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage += 1;
            this.getActivityRecordList();
        }
    }  // Ends: nextPage()

    /* Debouncing */
    debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
        clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
         };
    }  // Ends: debounce()

    /* Apply Filters */
    applyFilters() {
        this.currentPage = 1;
        this.getActivityRecordList();
    }  // Ends: applyFilters()

    seachChanged = this.debounce(() => this.applyFilters());

    /* Open Filter Modal */
    openFilterDialog() {
        const dialogRef = this.dialog.open(FilterModalComponent, {
            data: {
                employeeList: this.employeeList,
                taskList: this.taskList,
                timeSpanData: this.timeSpanData,
                sortType: this.sortType,
            }
        });

        /* On Closing Modal */
        dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this.taskList = data.filtersData.taskList;
                this.employeeList = data.filtersData.employeeList;
                this.timeSpanData = data.filtersData.timeSpanData;
                this.sortType = data.filtersData.sortType;
                this.applyFilters();
            }
        });
    }  // Ends: openFilterDialog()
}
