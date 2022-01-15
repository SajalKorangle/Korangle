import { Component, OnInit, Inject } from '@angular/core';
import { DataStorage } from "@classes/data-storage";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-modal.component.html',
    styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent implements OnInit {
    user: any;

    name: string;

    isEditing: boolean;

    checkBox: boolean;

    startDateTye: string = "Select Start Date";
    sDate: string = "";
    sDays: number = 0;

    endDateTye: string = "Select End Date";
    eDate: string = "";
    eDays: number = 0;

    complaintTypeList: any = [];
    statusList: any = [];

    constructor(
        public dialogRef: MatDialogRef<FilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

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
            this.unselectAllComplaintType();
            this.unselectAllStatus();
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
        if (!this.name) {
            alert("Please enter the name.");
            return;
        }

        let filtersData = {};

        filtersData["name"] = this.name;
        filtersData["complaintTypeList"] = this.complaintTypeList;
        filtersData["statusList"] = this.statusList;

        if(this.startDateTye != "Select Start Date" || this.endDateTye != "Select End Date") {
            if(this.startDateTye == "Select Start Date") {
                alert("Please select an option for the start date.");
                return;
            }

            if(this.endDateTye == "Select End Date") {
                alert("Please select an option for the end date.");
                return;
            }

            if(this.startDateTye == "Select Date" && this.sDate == "") {
                alert("Please enter the start date.");
                return;
            }

            if(this.endDateTye == "Select End Date" && this.eDate == "") {
                alert("Please enter the end date.");
                return;
            }

            if(this.startDateTye == "From Days Ago" && this.sDays == 0) {
                alert("Please enter the value of start days.");
                return;
            }

            if(this.endDateTye == "From Days Ago" && this.eDays == 0) {
                alert("Please enter the value of end days");
                return;
            }

            if(this.startDateTye == "1st of Ongoing Month") {
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

            if(this.endDateTye == "Current Date") {
                let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");

                if (parseInt(date) < 10) {
                    date = "0" + date;
                }
                if (parseInt(month) < 10) {
                    month = "0" + month;
                }

                this.eDate = year + "-" + month + "-" + date;
            }

            if(this.startDateTye == "From Days Ago") {
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
            }

            if(this.endDateTye == "From Days Ago") {
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
            }

            filtersData["startDate"] = this.sDate;
            filtersData["endDate"] = this.eDate;
        }

        /* Operation Type */
        if (this.isEditing) {
            filtersData["operation"] = "update";
            this.dialogRef.close({ filtersData: filtersData });
        } else {
            this.dialogRef.close({ filtersData: filtersData });
        }
        /* Ends:  Operation Type */
    }  // Ends: applyClick()
}
