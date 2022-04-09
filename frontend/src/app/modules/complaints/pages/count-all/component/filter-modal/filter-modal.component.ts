import { Component, OnInit, Inject } from '@angular/core';
import { DataStorage } from "@classes/data-storage";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { isMobile } from '@classes/common';

@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-modal.component.html',
    styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent implements OnInit {
    user: any;
    filter: any;

    name: string = "";
    isEditing: boolean = false;
    isNameProvided: boolean = true;

    /* Details of Start Date */
    startDateType: string = "";
    sDate: string = "";
    sDays: number = null;

    /* Details of Ends Date */
    endDateType: string = "";
    eDate: string = "";
    eDays: number = null;

    complaintTypeList: any = [];
    statusList: any = [];

    constructor(
        public dialogRef: MatDialogRef<FilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.complaintTypeList = data.complaintTypeList;
        this.statusList = data.statusList;

        /* Initialize Default Value of Filters */
        if (data["filter"]) {
            this.isEditing = true;
            this.filter = data.filter;
            this.name = this.filter["name"];

            /* Initialize complaint type list */
            if (this.filter["complaintTypeList"]) {
                this.complaintTypeList.forEach((complaintType) => {
                    let idx = this.filter["complaintTypeList"].indexOf(complaintType.id);
                    if (idx != -1) {
                        complaintType["selected"] = true;
                    }
                });
            }  // Ends: Initialize complaint type list

            /* Initialize status list */
            if (this.filter["statusList"]) {
                this.statusList.forEach((status) => {
                    let idx = this.filter["statusList"].indexOf(status.id);
                    if (idx != -1) {
                        status["selected"] = true;
                    }
                });
            }  // Ends: Initialize status list

            /* Initialize Date Information */
            if (this.filter["startDateType"]) {
                this.startDateType = this.filter["startDateType"];
                switch (this.startDateType) {
                    case "From Days Ago":
                        this.sDays = this.filter["sDays"];
                        break;

                    default:
                        this.sDate = this.filter["startDate"];
                }

                this.endDateType = this.filter["endDateType"];
                switch (this.endDateType) {
                    case "From Days Ago":
                        this.eDays = this.filter["eDays"];
                        break;

                    default:
                        this.eDate = this.filter["endDate"];
                }
            }  // Ends: Initialize Date Information
        }
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    /* For mobile-browser */
    isMobileBrowser(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }  // Ends: isMobileBrowser()

    /* For mobile-application */
    isMobileApplication(): boolean {
        return isMobile();
    }  // Ends: isMobileApplication()

    /* Make input-date non-typeable */
    handleOnKeyDown(event: any) {
        let keyPressed = event.keyCode;
        if (keyPressed != 8 && keyPressed != 46) { //check if it is not delete
            return false; // don't allow to input any value
        }
    }  // Ends: handleOnKeyDown()

    /* Unselect All ComplaintTypes */
    unselectAllComplaintType(): void {
        this.complaintTypeList.forEach((complaintType) => {
            complaintType.selected = false;
        });
    }  // Ends: unselectAllComplaintType()

    /* Select All ComplaintTypes */
    selectAllComplaintType(): void {
        this.complaintTypeList.forEach((complaintType) => {
            complaintType.selected = true;
        });
    }  // Ends: selectAllComplaintType()

    /* Unselect All Statuses */
    unselectAllStatus(): void {
        this.statusList.forEach((status) => {
            status.selected = false;
        });
    }  // Ends: unselectAllStatus()

    /* Select All Statuses */
    selectAllStatus(): void {
        this.statusList.forEach((status) => {
            status.selected = true;
        });
    }  // Ends: selectAllStatus()

    /* Delete Button Clicked */
    deleteClick(): void {
        let conformation = confirm("Do you really want to delete this?");
        if (conformation) {
            if (this.isEditing) {
                let filtersData = {};
                filtersData["operation"] = "delete";
                this.dialogRef.close({ filtersData: filtersData });
            }
            else {
                this.dialogRef.close();
            }
        }
    }  // Ends: deleteClick()

    /* Apply Button Clicked */
    applyClick(): void {
        if (!this.name.toString().trim()) {
            this.isNameProvided = false;
            alert("Please enter the name.");
            return;
        }
        this.isNameProvided = true;

        let filtersData = {};
        filtersData["name"] = this.name.toString().trim();

        /* Selected Complaint Types */
        let complaintTypeList = [];
        this.complaintTypeList.forEach((complaintType) => {
            if (complaintType.selected) {
                complaintTypeList.push(complaintType.id);
            }
        });
        if (complaintTypeList.length) {
            filtersData["complaintTypeList"] = complaintTypeList;
        }  // Ends: Selected Complaint Types

        /* Selected Statuses */
        let statusList = [];
        this.statusList.forEach((status) => {
            if (status.selected) {
                statusList.push(status.id);
            }
        });
        if (statusList.length) {
            filtersData["statusList"] = statusList;
        }  // Ends: Selected Statuses

        /* Validation: Start Date  &&  End Date */
        if (this.startDateType || this.endDateType) {

            if (!this.startDateType) {
                alert("Please select an option for the start date.");
                return;
            }

            if (!this.endDateType) {
                alert("Please select an option for the end date.");
                return;
            }

            if (this.startDateType == "Select Date" && this.sDate == "") {
                alert("Please enter the start date.");
                return;
            }

            if (this.endDateType == "Select End Date" && this.eDate == "") {
                alert("Please enter the end date.");
                return;
            }

            if (this.startDateType == "From Days Ago" && (!this.sDays || this.sDays < 0)) {
                alert("Please enter the valid value of start days.");
                return;
            }

            if (this.endDateType == "From Days Ago" && (!this.eDays || this.eDays < 0)) {
                alert("Please enter the valid value of end days");
                return;
            }

            if (this.startDateType == "1st of Ongoing Month") {  // Start Date Type: 1st day of month
                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
                [month, date, year] = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString("en-US").split("/");

                if (parseInt(date) < 10) {
                    date = "0" + date;
                }
                if (parseInt(month) < 10) {
                    month = "0" + month;
                }

                this.sDate = year + "-" + month + "-" + date;
            }

            if (this.startDateType == "From Days Ago") {  // Start Date Type: From Days Ago
                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
                var result = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
                result.setDate(result.getDate() - this.sDays);
                [month, date, year] = result.toLocaleDateString("en-US").split("/");

                if (parseInt(date) < 10) {
                    date = "0" + date;
                }
                if (parseInt(month) < 10) {
                    month = "0" + month;
                }

                this.sDate = year + "-" + month + "-" + date;
                filtersData["sDays"] = this.sDays;
            }

            if (this.endDateType == "Current Date") {  // End Date Type: Today
                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");

                if (parseInt(date) < 10) {
                    date = "0" + date;
                }
                if (parseInt(month) < 10) {
                    month = "0" + month;
                }

                this.eDate = year + "-" + month + "-" + date;
            }

            if (this.endDateType == "From Days Ago") {  // End Date Type: From Days Ago
                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
                var result = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
                result.setDate(result.getDate() - this.eDays);
                [month, date, year] = result.toLocaleDateString("en-US").split("/");

                if (parseInt(date) < 10) {
                    date = "0" + date;
                }
                if (parseInt(month) < 10) {
                    month = "0" + month;
                }

                this.eDate = year + "-" + month + "-" + date;
                filtersData["eDays"] = this.eDays;
            }

            let startDateTime = new Date(this.sDate).getTime();
            let endDateTime = new Date(this.eDate).getTime();

            if (endDateTime < startDateTime) {
                this.sDate = "";
                this.eDate = "";
                this.sDays = null;
                this.eDays = null;
                alert("The start date must come before the end date.");
                return;
            }

            filtersData["startDate"] = this.sDate;
            filtersData["startDateType"] = this.startDateType;
            filtersData["endDate"] = this.eDate;
            filtersData["endDateType"] = this.endDateType;
        }  // Ends: Validation: Start Date  &&  End Date

        /* Operation Type */
        if (this.isEditing) {
            filtersData["operation"] = "update";
            this.dialogRef.close({ filtersData: filtersData });
        } else {
            this.dialogRef.close({ filtersData: filtersData });
        }  //Ends: Operation Type

    }  // Ends: applyClick()
}
