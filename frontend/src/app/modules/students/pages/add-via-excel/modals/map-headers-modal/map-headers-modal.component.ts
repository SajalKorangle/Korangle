import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataStorage } from '@classes/data-storage';

@Component({
    selector: 'map-headers-modal',
    templateUrl: './map-headers-modal.component.html',
    styleUrls: ['./map-headers-modal.component.css']
})
export class MapHeadersModalComponent implements OnInit {

    user: any;

    tableData: any;

    softwareColumnHeaderList: any;

    constructor(
        public dialogRef: MatDialogRef<MapHeadersModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.tableData = data.tableData;
        this.softwareColumnHeaderList = data.softwareColumnHeaderList;
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    getFilteredSoftwareColumnHeaderList(tableColumnHeader: any): any {
        return this.softwareColumnHeaderList.filter((softwareColumnHeader) => {
            return this.tableData[0].find(columnHeader => {
                return tableColumnHeader != columnHeader &&
                    columnHeader.softwareColumnHeader &&
                    columnHeader.softwareColumnHeader.name == softwareColumnHeader.name;
            }) == undefined;
        });
    }

    // Starts :- Close Modal
    closeClicked() {
        this.dialogRef.close();
    }
    // Ends :- Close Modal

}