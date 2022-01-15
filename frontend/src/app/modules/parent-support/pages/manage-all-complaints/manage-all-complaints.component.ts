import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";
import { MatDialog } from '@angular/material';

import { AssignEmployeeComponent } from '@modules/parent-support/component/assign-employee/assign-employee.component';

@Component({
    selector: 'app-manage-all-complaints',
    templateUrl: './manage-all-complaints.component.html',
    styleUrls: ['./manage-all-complaints.component.css']
})
export class ManageAllComplaintsComponent implements OnInit {
    user: any;

    pageName: string = "showTables";

    complaintList: any = [];

    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

    /* Open Filter Modal */
    openAssignEmployeeDialog(): void {
        const dialogRef = this.dialog.open(AssignEmployeeComponent, {
            data: {
                msg: "Hello",
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            // if (data && data.filtersData) {
            //     let filtersData = data.filtersData;
            //     if (this.whereToAdd === 'row') {  /* Row Filter */
            //         let returnData = this.getTableDataRow(filtersData);
            //         filtersData["answer"] = returnData.answer;
            //         filtersData["totalCount"] = returnData.totalCount;
            //         this.rowFilters.push(filtersData);
            //     } else if (this.whereToAdd === 'col') {  /* Column Filter */
            //         filtersData["totalCount"] = this.getTableDataColumn(filtersData);
            //         this.columnFilters.push(filtersData);
            //     }
            // } else {
            //     this.classSectionList.forEach((classs) => {
            //         classs.sectionList.forEach((section) => {
            //             section.selected = false;
            //         });
            //     });
            // }
            console.log("closed");
        });
    }  // Ends: openAddStatusDialog()

    openComplaint(complaint, idx) {
        this.pageName = "showComplaint";
        
    }
}
