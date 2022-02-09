import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DataStorage } from '../../../../classes/data-storage';
import { FilterModalHtmlRenderer } from './filter-modal.html.renderer';

@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-modal.component.html',
    styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent implements OnInit {
    user: any;

    employeeList: any = [];
    taskList: any = [];
    timeSpan: any = {};

    startDate: string = "";    /* Type of Start Date */
    sDate: string = "";    /* Start Date */
    startDays: number = 0;    /* Start Days Ago */

    endDate: string = "";    /* Type of End Date */
    eDate: string = "";    /* End Date */
    endDays: number = 0;    /* End Days Ago */

    sortType: string = "";

    htmlRenderer: FilterModalHtmlRenderer;

    constructor(
        public dialogRef: MatDialogRef<FilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.employeeList = data.employeeList;
        this.taskList = data.taskList;

        /* Initializing Sort Type */
        if (data.sortType) {
            if (data.sortType[0] == 'N') {
                this.sortType = "Newest First";
            } else {
                this.sortType = "Oldest First";
            }
        }

        /* Initializing Data of Time Span Section */
        if (data.timeSpanData["dateFormat"] != "- None") {

            if (data.timeSpanData.startDateType == "sDate") {   // Start Date Type: startDate
                this.startDate = "sDate";
                let startDate = data.timeSpanData["dateFormat"].split(" ")[0];
                let [sDate, sMonth, sYear] = startDate.split("-");
                this.sDate = sYear + "-" + sMonth + "-" + sDate;

            } else if (data.timeSpanData.startDateType == "dayOne") {   // Start Date Type: 1st day of month
                this.startDate = "dayOne";

            } else if (data.timeSpanData.startDateType.includes("startDays")) {   // Start Date Type: days ago
                this.startDate = "startDays";
                this.startDays = 0;
                for (let i = 9; i < data.timeSpanData.startDateType.length; i++) {
                    this.startDays *= 10;
                    this.startDays += parseInt(data.timeSpanData.startDateType[i]);
                }
            }

            if (data.timeSpanData.endDateType == "eDate") {   // End Date Type: endDate
                this.endDate = "eDate";
                let endDate = data.timeSpanData["dateFormat"].split(" ")[2];
                let [eDate, eMonth, eYear] = endDate.split("-");
                this.eDate = eYear + "-" + eMonth + "-" + eDate;

            } else if (data.timeSpanData.endDateType == "today") {   // End Date Type: today
                this.endDate = "today";

            } else if (data.timeSpanData.endDateType.includes("endDays")) {   // End Date Type: days ago
                this.endDate = "endDays";
                this.endDays = 0;
                for (let i = 7; i < data.timeSpanData.endDateType.length; i++) {
                    this.endDays *= 10;
                    this.endDays += parseInt(data.timeSpanData.endDateType[i]);
                }
            }

        }

        this.htmlRenderer = new FilterModalHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    /* Make input-date non-typeable */
    handleOnKeyDown(event: any) {
        let keyPressed = event.keyCode;
        if (keyPressed != 8 && keyPressed != 46) { //check if it is not delete
            return false; // don't allow to input any value
        }
    }  // Ends: handleOnKeyDown()

    /* Newest or Oldest */
    getSortType() {
        if (this.sortType) {
            return ", " + this.sortType;
        }
        return "";
    }  // Ends: getSortType()

    /* Select All Pages */
    selectAllPages() {
        this.taskList.forEach((task) => {
            task.selected = true;
        });
    }  // Ends: selectAllPages()

    /* Unselect All Pages */
    unselectAllPages() {
        this.taskList.forEach((task) => {
            task.selected = false;
        });
    }  // Ends: unselectAllPages()

    /* Select All Employees */
    selectAllEmployees() {
        this.employeeList.forEach((employee) => {
            employee.selected = true;
        });
    }  // Ends: selectAllEmployees()

    /* Unselect All Employees */
    unselectAllEmployees() {
        this.employeeList.forEach((employee) => {
            employee.selected = false;
        });
    }  // Ends: unselectAllEmployees()

    /* Unmark Dates */
    unmarkDates() {
        this.startDate = null;
        this.endDate = null;
        this.sortType = null;
    }  // Ends: unmarkDates()

    /* Clear All Clicked */
    clearAllClick(): void {
        let conformation = confirm("Do you really want to clear this?");
        if (conformation) {
            this.unselectAllEmployees();
            this.unselectAllPages();
            this.unmarkDates();
        }
    }  // Ends: clearAllClick()

    /* Apply Clicked */
    applyClick() {
        let filtersData = {};
        filtersData["taskList"] = this.taskList;
        filtersData["employeeList"] = this.employeeList;

    /* Start Date  &&  End Date Validation */

        /* If startDate is selected, user need to provide the endDate. */
        if (this.startDate && !this.endDate) {
            alert("Please enter the End Date.");
            return;
        }

        /* If endDate is selected, user need to provide the startDate. */
        if (!this.startDate && this.endDate) {
            alert("Please enter the Start Date.");
            return;
        }

        /* If Start Date is selected, user need to provide the Start Date. */
        if (this.startDate && this.startDate == "sDate" && !this.sDate) {
            alert("Please enter the start date.");
            return;
        }

        /* If Start Days Ago are selected, user need to provide Start Days. */
        if (this.startDate && this.startDate == "startDays" && (this.startDays == null || this.startDays == undefined)) {
            alert("Please enter the value of days ago in the start date section.");
            return;
        }

        /* If End Date is selected, user need to provide the End Date. */
        if (this.endDate && this.endDate == "eDate" && !this.eDate) {
            alert("Please enter the end date.");
            return;
        }

        /* If End Days Ago are selected, user need to provide End Days. */
        if (this.endDate && this.endDate == "endDays" && (this.endDays == null || this.endDays == undefined)) {
            alert("Please enter the value of days ago in the end date section.");
            return;
        }

        let timeSpanData = this.htmlRenderer.getTimeSpanData();
        filtersData["timeSpanData"] = timeSpanData;

        /* "Start Date - End Date" Validation [Start Date must come before the End Date] */
        if (timeSpanData["dateFormat"] && timeSpanData["dateFormat"] != "- None") {
            let startDate = timeSpanData["dateFormat"].split(" ")[0];
            let endDate = timeSpanData["dateFormat"].split(" ")[2];

            let [sDate, sMonth, sYear] = startDate.split("-");
            let [eDate, eMonth, eYear] = endDate.split("-");

            if (parseInt(sYear) > parseInt(eYear)) {
                alert("Start Date must come before End Date.");
                return;
            } else if (parseInt(sYear) === parseInt(eYear) && parseInt(sMonth) > parseInt(eMonth)) {
                alert("Start Date must come before End Date.");
                return;
            } else if (parseInt(sYear) === parseInt(eYear) && parseInt(sMonth) === parseInt(eMonth) && parseInt(sDate) > parseInt(eDate)) {
                alert("Start Date must come before End Date.");
                return;
            }
            /* End of "Start Date - End Date" Validation */
        }

    /* End of Start Date  &&  End Date Validation */

        if (this.sortType) {
            filtersData["sortType"] = this.sortType;
        } else {
            filtersData["sortType"] = "";
        }
        this.dialogRef.close({ filtersData: filtersData });
    }  // Ends: applyClick()
}
