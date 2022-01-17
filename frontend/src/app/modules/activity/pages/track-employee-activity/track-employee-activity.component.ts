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
            let bgColor = this.getBackgroundColor();
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

    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    /* Covert HEX color code to RGB color code */
    hexToRGBA(hex: string) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const alpha = "0.5";
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }  // Ends: hexToRGBA()

    /* Generate Random Color */
    getBackgroundColor(): string {
        let randomColor = "#4CAF50";
        while (true) {
            randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
            if (!this.backgroundColorList.includes(randomColor) && randomColor != "#FFFFFF" && randomColor != "#ffffff") {
                break;
            }
        }
        this.backgroundColorList.push(randomColor);
        return this.hexToRGBA(randomColor);
    }  // Ends: getBackgroundColor()

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

    /* Time(hh:mm)  &&  Date(dd month_name year) */
    getDateTimeOfRecord(record) {
        let createdAt = record.createdAt;
        let timeDate = "";
        let hour = createdAt[11] + createdAt[12];
        let minutes = createdAt[14] + createdAt[15];

        let year = createdAt[0] + createdAt[1] + createdAt[2] + createdAt[3];
        let month = parseInt(createdAt[5] + createdAt[6]);
        let date = createdAt[8] + createdAt[9];

        timeDate = hour + ":" + minutes + ", " + date;

        if (parseInt(date) === 1) {
            timeDate += "st ";
        } else if (parseInt(date) === 2) {
            timeDate += "nd ";
        } else if (parseInt(date) === 3) {
            timeDate += "rd ";
        } else {
            timeDate += "th ";
        }

        if (month == 1) {
            timeDate += "January ";
        } else if (month == 2) {
            timeDate += "February ";
        } else if (month == 3) {
            timeDate += "March ";
        } else if (month == 4) {
            timeDate += "April ";
        } else if (month == 5) {
            timeDate += "May ";
        } else if (month == 6) {
            timeDate += "June ";
        } else if (month == 7) {
            timeDate += "July ";
        } else if (month == 8) {
            timeDate += "August ";
        } else if (month == 9) {
            timeDate += "September ";
        } else if (month == 10) {
            timeDate += "October ";
        } else if (month == 11) {
            timeDate += "November ";
        } else if (month == 12) {
            timeDate += "December ";
        }

        timeDate += year;
        return timeDate;
    }  // Ends: getDateTimeOfRecord()

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
