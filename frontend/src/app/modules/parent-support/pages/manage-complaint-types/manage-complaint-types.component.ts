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

    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        console.log("User: ", this.user);
    }

    /* Open Filter Modal */
    openAddStatusDialog(): void {
        const dialogRef = this.dialog.open(AddStatusModalComponent, {
            data: {
                // classSectionList: this.classSectionList,
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
}
