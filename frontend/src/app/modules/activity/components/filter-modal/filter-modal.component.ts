import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DataStorage } from '../../../../classes/data-storage';


@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-modal.component.html',
    styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent implements OnInit {
    user;

    employeeList = [];
    taskList = [];
    timeSpan = {};

    startDate;    /* Type of Start Date */
    sDate;    /* Start Date */
    startDays = 0;    /* Start Days Ago */

    endDate;    /* Type of End Date */
    eDate;    /* End Date */
    endDays = 0;    /* End Days Ago */

    sortType;

    constructor(
        public dialogRef: MatDialogRef<FilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.employeeList = data.employeeList;
        this.taskList = data.taskList;

        if(data.sortType) {
            if(data.sortType[0] == 'N') {
                this.sortType = "Newest First";
            } else {
                this.sortType = "Oldest First";
            }
        }

        /* Initializing Data of Time Span Section */
        if(data.timeSpanData["dateFormat"] != "- None") {

            if(data.timeSpanData.startDateType == "sDate") {
                this.startDate = "sDate";
                let startDate = data.timeSpanData["dateFormat"].split(" ")[0];
                let [sDate, sMonth, sYear] = startDate.split("-");
                this.sDate = sYear + "-" + sMonth + "-" + sDate;

            } else if(data.timeSpanData.startDateType == "dayOne") {
                this.startDate = "dayOne";

            } else if(data.timeSpanData.startDateType.includes("startDays")) {
                this.startDate = "startDays";
                this.startDays = 0;
                for(let i = 9; i < data.timeSpanData.startDateType.length; i++) {
                    this.startDays *= 10;
                    this.startDays += parseInt(data.timeSpanData.startDateType[i]);
                }
            }

            if(data.timeSpanData.endDateType == "eDate") {
                this.endDate = "eDate";
                let endDate = data.timeSpanData["dateFormat"].split(" ")[2];
                let [eDate, eMonth, eYear] = endDate.split("-");
                this.eDate = eYear + "-" + eMonth + "-" + eDate;

            } else if(data.timeSpanData.endDateType == "today") {
                this.endDate = "today";

            } else if(data.timeSpanData.endDateType.includes("endDays")) {
                this.endDate = "startDays";
                this.endDays = 0;
                for(let i = 7; i < data.timeSpanData.endDateType.length; i++) {
                    this.endDays *= 10;
                    this.endDays += parseInt(data.timeSpanData.endDateType[i]);
                }
            }

        }
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    /* Selected Pages in Modal */
    getPagesList() {
        let list = "";
        this.taskList.forEach((task) => {
            if(task.selected) {
                if(list == "") {
                    list = task.moduleTitle + " - " + task.taskTitle;
                } else {
                    list = list + ", " + task.moduleTitle + " - " + task.taskTitle;
                }
            }
        });

        if(list == "") {
            list = "- None";
        } else {
            list = "( " + list + " )";
        }
        return list;
    }

    /* Selected Employees in Modal */
    getEmployeesList() {
        let list = "";
        this.employeeList.forEach((employee) => {
            if(employee.selected) {
                if(list == "") {
                    list = employee.name;
                } else {
                    list = list + ", " + employee.name;
                }
            }
        });

        if(list == "") {
            list = "- None";
        } else {
            list = "( " + list + " )";
        }
        return list;
    }

    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    /* Format: "-None"  or  "StarteDate to EndDate" */
    getTimeSpanData() {
        let startDate, endDate;
        let timeSpanData = {};
        if(this.startDate && this.endDate) {
            if(this.startDate == "sDate") {
                if(!this.sDate) {
                    timeSpanData["dateFormat"] = "- None";
                    return timeSpanData;
                }

                let [year, month, date] = this.sDate.split("-");
                let newDate = "";
                newDate = date + "-" + month + "-" + year;
                startDate = newDate;
                timeSpanData["startDateType"] = "sDate";

            } else if(this.startDate == "dayOne") {
                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
                [month, date, year] = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString("en-US").split("/");

                let newDate = "";
                if(parseInt(date) < 10) {
                    newDate = "0" + date + "-" + month + "-" + year;
                } else {
                    newDate = date + "-" + month + "-" + year;
                }
                startDate = newDate;
                timeSpanData["startDateType"] = "dayOne";

            } else if(this.startDate == "startDays") {

                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
                var result = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
                result.setDate(result.getDate() - this.startDays);
                [month, date, year] = result.toLocaleDateString("en-US").split("/");

                let newDate = "";
                if(parseInt(date) < 10) {
                    newDate = "0" + date + "-" + month + "-" + year;
                } else {
                    newDate = date + "-" + month + "-" + year;
                }
                startDate = newDate;
                timeSpanData["startDateType"] = "startDays" + this.startDays;
            }

            if(this.endDate == "eDate") {
                if(!this.eDate) {
                    timeSpanData["dateFormat"] = "- None";
                    return timeSpanData;
                }

                let [year, month, date] = this.eDate.split("-");
                let newDate = "";
                newDate = date + "-" + month + "-" + year;
                endDate = newDate;
                timeSpanData["endDateType"] = "eDate";

            } else if(this.endDate == "today") {
                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");

                let newDate = "";
                if(parseInt(date) < 10) {
                    newDate = "0" + date + "-" + month + "-" + year;
                } else {
                    newDate = date + "-" + month + "-" + year;
                }
                endDate = newDate;
                timeSpanData["endDateType"] = "today";

            } else if(this.endDate == "endDays") {

                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
                var result = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
                result.setDate(result.getDate() - this.endDays);
                [month, date, year] = result.toLocaleDateString("en-US").split("/");

                let newDate = "";
                if(parseInt(date) < 10) {
                    newDate = "0" + date + "-" + month + "-" + year;
                } else {
                    newDate = date + "-" + month + "-" + year;
                }
                endDate = newDate;
                timeSpanData["endDateType"] = "endDays" + this.endDays;
            }

            let dateFormat = startDate + " to " + endDate;
            timeSpanData["dateFormat"] = dateFormat;
            return timeSpanData;
        }
        timeSpanData["dateFormat"] = "- None";
        return timeSpanData;
    }
    /* End of Get Time Span Data */

    /* Newest or Oldest */
    getSortType() {
        if(this.sortType) {
            return ", " + this.sortType;
        }
        return "";
    }

    /* Select All Pages */
    selectAllPages() {
        this.taskList.forEach((task) => {
            task.selected = true;
        });
    }

    /* Unselect All Pages */
    unselectAllPages() {
        this.taskList.forEach((task) => {
            task.selected = false;
        });
    }

    /* Select All Employees */
    selectAllEmployees() {
        this.employeeList.forEach((employee) => {
            employee.selected = true;
        });
    }

    /* Unselect All Employees */
    unselectAllEmployees() {
        this.employeeList.forEach((employee) => {
            employee.selected = false;
        });
    }

    /* Clear All Clicked */
    clearAllClick(): void {
        let conformation = confirm("Do you really want to clear this?");
        if(conformation) {
            this.unselectAllEmployees();
            this.unselectAllPages();
        }
    }

    /* Apply Clicked */
    applyClick() {
        let filtersData = {};
        filtersData["taskList"] = this.taskList;
        filtersData["employeeList"] = this.employeeList;

    /* Start Date  &&  End Date Validation */

        /* If startDate is selected, user need to provide the endDate. */
        if(this.startDate && !this.endDate) {
            alert("Please enter the End Date.");
            return;
        }

        /* If endDate is selected, user need to provide the startDate. */
        if(!this.startDate && this.endDate) {
            alert("Please enter the Start Date.");
            return;
        }

        /* If Start Date is selected, user need to provide the Start Date. */
        if(this.startDate && this.startDate == "sDate" && !this.sDate) {
            alert("Please enter the start date.");
            return;
        }

        /* If Start Days Ago are selected, user need to provide Start Days. */
        if(this.startDate && this.startDate == "startDays" && this.startDays === 0) {
            alert("Please enter the value of days ago in the start date section.");
            return;
        }

        /* If End Date is selected, user need to provide the End Date. */
        if(this.endDate && this.endDate == "eDate" && !this.eDate) {
            alert("Please enter the end date.");
            return;
        }

        /* If End Days Ago are selected, user need to provide End Days. */
        if(this.endDate && this.endDate == "endDays" && this.endDays === 0) {
            alert("Please enter the value of days ago in the end date section.");
            return;
        }

        let timeSpanData = this.getTimeSpanData();
        filtersData["timeSpanData"] = timeSpanData;

        /* "Start Date - End Date" Validation [Start Date must come before the End Date] */
        if(timeSpanData["dateFormat"] && timeSpanData["dateFormat"] != "- None") {
            let startDate = timeSpanData["dateFormat"].split(" ")[0];
            let endDate = timeSpanData["dateFormat"].split(" ")[2];

            let [sDate, sMonth, sYear] = startDate.split("-");
            let [eDate, eMonth, eYear] = endDate.split("-");

            if(parseInt(sYear) > parseInt(eYear)) {
                alert("Start Date must come before End Date.");
                return;
            } else if(parseInt(sYear) === parseInt(eYear) && parseInt(sMonth) > parseInt(eMonth)) {
                alert("Start Date must come before End Date.");
                return;
            } else if(parseInt(sYear) === parseInt(eYear) && parseInt(sMonth) === parseInt(eMonth) && parseInt(sDate) > parseInt(eDate)) {
                alert("Start Date must come before End Date.");
                return;
            }
            /* End of "Start Date - End Date" Validation */
        }

    /* End of Start Date  &&  End Date Validation */

        if(this.sortType) {
            filtersData["sortType"] = this.sortType;
        } else {
            filtersData["sortType"] = "";
        }
        this.dialogRef.close({ filtersData: filtersData });
    }
}
