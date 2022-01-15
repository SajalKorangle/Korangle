import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { AddStatusModalComponent } from '@modules/parent-support/component/add-status-modal/add-status-modal.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-manage-complaint-types',
    templateUrl: './manage-complaint-types.component.html',
    styleUrls: ['./manage-complaint-types.component.css']
})
export class ManageComplaintTypesComponent implements OnInit {
    user: any;

    name: string;
    pageName: string = "showTables";

    helloCheckBox: boolean;

    maxAge: number;


    statusName: string = "";
    statusList: any = [];

    editingCompalaintType: boolean = false;
    editingCompalaintTypeIndex: number;
    typeName: string = "";
    defaultText: string = "";
    addressToSearchString: string = "";
    addStatusName: string = "";
    defaultStatus: string = "Select Default Status";
    complaintTypeList: any = [];

    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

    /* Open Add Status Modal */
    openAddStatusDialog(): void {
        const dialogRef = this.dialog.open(AddStatusModalComponent, {
            data: {
                operation: "Add",
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            console.log("Data: ", data);
            if(data && data["statusName"]) {
                let status = {};
                status["statusName"] = data["statusName"];
                this.statusList.push(status);
            }
        });
    }

    /* Open Edit Filter Modal */
    openChangeStatusDialog(status, idx): void {
        const dialogRef = this.dialog.open(AddStatusModalComponent, {
            data: {
                operation: "Edit",
                statusName: status.statusName,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            console.log("Data: ", data);
            if(data && data["statusName"]) {
                this.statusList[idx]["statusName"] = data["statusName"];
            }
        });
    }

    initializeComplaintTypeDetails() {
        this.editingCompalaintType = false;
        this.typeName = "";
        this.defaultText = "";
        this.addressToSearchString = "";
        this.addStatusName = "";
        this.defaultStatus = "Select Default Status";
    }

    saveClicked() {
        let complaintType = {};

        if(!this.typeName) {
            alert("Please enter complaint type name.");
            return;
        }

        if(!this.defaultText) {
            alert("Please enter default text.");
            return;
        }

        if(!this.defaultStatus) {
            alert("Please enter default status.");
            return;
        }

        complaintType["name"] = this.typeName;
        complaintType["defaultText"] = this.defaultText;
        complaintType["defaultStatus"] = this.defaultStatus;

        if(this.editingCompalaintType) {
            this.complaintTypeList[this.editingCompalaintTypeIndex] = complaintType;
            this.editingCompalaintType = false;
        } else {
            this.complaintTypeList.push(complaintType);
        }
        this.initializeComplaintTypeDetails();
        this.pageName = "showTables";
    }

    cancelClicked() {
        this.initializeComplaintTypeDetails();
        this.pageName = "showTables";
    }

    editComplaintType(complaintType, idx) {
        this.typeName = complaintType.name;
        this.defaultText = complaintType.defaultText;
        this.defaultStatus = complaintType.defaultStatus;
        this.pageName = "addCompalintType";
        this.editingCompalaintType = true;
        this.editingCompalaintTypeIndex = idx;
    }

    deleteComplaintType(idx) {
        this.complaintTypeList.splice(idx, 1);
    }

    deleteStatus(idx) {
        this.statusList.splice(idx, 1);
    }
}
