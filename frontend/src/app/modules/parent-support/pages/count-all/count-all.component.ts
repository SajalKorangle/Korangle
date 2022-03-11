import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

import { MatDialog } from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { CommonFunctions } from "../../../../classes/common-functions";

import { ExcelService } from '../../../../excel/excel-service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_COUNT_ALL_TABLE_PARENT_SUPPORT } from '../../../../print/print-routes.constants';

import { CountAllServiceAdapter } from './count-all.service.adapter';
import { CountAllHtmlRenderer } from './count-all.html.renderer';
import { FilterModalComponent } from '@modules/parent-support/pages/count-all/component/filter-modal/filter-modal.component';
import { FormatTableModalComponent } from '@modules/parent-support/pages/count-all/component/format-table-modal/format-table-modal.component';
import { DeleteTableModalComponent } from '@modules/parent-support/component/delete-table-modal/delete-table-modal.component';

@Component({
    selector: 'app-count-all',
    templateUrl: './count-all.component.html',
    styleUrls: ['./count-all.component.css'],
    providers: [ExcelService],
})
export class CountAllComponent implements OnInit {
    user;
    isLoading: boolean = false;
    NULL_CONSTANT = null;

    isTableEditing: boolean = false;
    isTableUpdated: boolean = false;
    tableActiveId: number = 0;
    tableActiveIdx: number = 0;
    tableFormatTitle: string = "";     // Table Name
    whereToAdd: string = "";    // Row  or  Column
    rowFilters: any = [];    // Row List
    columnFilters: any = [];    // Column List
    tableList: any = [];

    complaintTypeList: any = [];
    statusList: any = [];
    complaintList: any = [];

    serviceAdapter: CountAllServiceAdapter;
    htmlRenderer: CountAllHtmlRenderer;

    constructor(
        public excelService: ExcelService,
        public printService: PrintService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new CountAllServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new CountAllHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    /* Initialize Complaint Type List */
    initializecomplaintTypeList(complaintTypeList) {

        let nullComplaintType = {
            id: null,
            defaultText: '',
            name: 'Not Selected',
            parentSchoolComplaintStatusDefault: null,
            parentSchool: null,
            selected: false,
        };

        this.complaintTypeList = [];
        this.complaintTypeList.push(nullComplaintType);

        complaintTypeList.forEach((complaintType) => {
            complaintType["selected"] = false;
            this.complaintTypeList.push(complaintType);
        });

    }  // Ends: initializecomplaintTypeList()

    /* Initialize Status List */
    initializeStatusList(statusList) {
        let nullStatus = {
            id: null,
            name: 'Not Applicable',
            parentSchool: null,
            selected: false,
        };

        this.statusList = [];
        this.statusList.push(nullStatus);

        statusList.forEach((status) => {
            status["selected"] = false;
            this.statusList.push(status);
        });
    }  // Ends: initializeStatusList()

    /* Initialize Table Details */
    initializeTableDetails() {
        this.isTableUpdated = false;
        this.isTableEditing = false;
        this.tableActiveId = 0;
        this.tableActiveIdx = 0;
        this.tableFormatTitle = "";
        this.columnFilters = [];
        this.rowFilters = [];
    }  // Ends: initializeTableDetails()

    /* Update Row Data After Column Drag */
    updateRowFiltersAfterColumnDrag(): void {
        for (let i = 0; i < this.rowFilters.length; i++) {
            // initializing the result.
            for (let j = 0; j < this.columnFilters.length; j++) {
                this.rowFilters[i]["answer"][j] = 0;
            }

            // Logic:  first check complaint with row, and then with column.
            this.complaintList.forEach((complaint) => {
                let check = this.checkFilters(complaint, this.rowFilters[i]);
                if (check) {
                    for (let j = 0; j < this.columnFilters.length; j++) {
                        check = this.checkFilters(complaint, this.columnFilters[j]);
                        if (check) {
                            this.rowFilters[i]["answer"][j] += 1;
                        }
                    }
                }
            });
        }
    }  // Ends: updateRowFiltersAfterColumnDrag()

    /* Will be Called After Dragging of a Row */
    dropRow(event: CdkDragDrop<string[]>): void {
        this.isTableUpdated = true;
        moveItemInArray(this.rowFilters, event.previousIndex, event.currentIndex);
    }  // Ends: dropRow()

    /* Will be Called After Dragging of a Column */
    dropColumn(event: CdkDragDrop<string[]>): void {
        this.isTableUpdated = true;
        moveItemInArray(this.columnFilters, event.previousIndex, event.currentIndex);
        this.updateRowFiltersAfterColumnDrag();
    }  // Ends: dropColumn()

    /* Check Applied set of Filters on a Student */
    checkFilters(complaint, filtersData): any {
        let check = true;
        for (const filter in filtersData) {

            if (filter == "complaintTypeList") {  /* Check Complaint Type */

                let idx = filtersData["complaintTypeList"].indexOf(complaint.parentSchoolComplaintType);
                if (idx == -1) {
                    check = false;
                    break;
                }

            } else if (filter == "statusList") {  /* Check Status */

                let idx = filtersData["statusList"].indexOf(complaint.parentSchoolComplaintStatus);
                if (idx == -1) {
                    check = false;
                    break;
                }

            } else if (filter == "startDate") {  /* Date Range Check */

                let complaintDate = new Date(complaint.dateSent).getTime();
                let filterStartDate = new Date(filtersData["startDate"]).getTime();
                let filterEndDate = new Date(filtersData["endDate"]).getTime();

                if (complaintDate < filterStartDate || complaintDate > filterEndDate) {
                    check = false;
                    break;
                }

            }
        }
        return check;
    }  // Ends: checkFilters()

    /* Get Table Date From Newly Added Row */
    getTableDataRow(filtersData): any {

        // initializing the result.
        let totalCount = 0;
        let answer = [];
        for (let i = 0; i < this.columnFilters.length; i++) {
            answer.push(0);
        }

        // Logic:  first check complaint with row, and then with column.
        this.complaintList.forEach((complaint) => {
            let check = this.checkFilters(complaint, filtersData);
            if (check) {
                totalCount += 1;
                for (let i = 0; i < this.columnFilters.length; i++) {
                    let columnFilterData = this.columnFilters[i];
                    check = this.checkFilters(complaint, columnFilterData);
                    if (check) {
                        answer[i] += 1;
                    }
                }
            }
        });  // Ends: Logic

        let returnData = {};
        returnData["answer"] = answer;
        returnData["totalCount"] = totalCount;
        return returnData;
    }  // Ends: getTableDataRow()

    /* Get Table Date From Newly Added Column */
    getTableDataColumn(filtersData): any {

        // initializing the result.
        let totalCount = 0;
        for (let i = 0; i < this.rowFilters.length; i++) {
            this.rowFilters[i].answer.push(0);
        }

        // Logic:  first check complaint with column, and then with row.
        this.complaintList.forEach((complaint) => {
            let check = this.checkFilters(complaint, filtersData);
            if (check) {
                totalCount += 1;
                for (let i = 0; i < this.rowFilters.length; i++) {
                    let rowFilterData = this.rowFilters[i];
                    check = this.checkFilters(complaint, rowFilterData);
                    if (check) {
                        this.rowFilters[i].answer[this.rowFilters[i].answer.length - 1] += 1;
                    }
                }
            }
        });   // Ends: Logic
        return totalCount;
    }  // Ends: getTableDataColumn()

    /* Get Updated Table Date */
    getUpdatedTableDataColumn(filtersData, index): any {

        // initializing the result.
        let totalCount = 0;
        for (let i = 0; i < this.rowFilters.length; i++) {
            this.rowFilters[i].answer[index] = 0;
        }

        // Logic:  first check complaint with column, and then with row.
        this.complaintList.forEach((complaint) => {
            let check = this.checkFilters(complaint, filtersData);
            if (check) {
                totalCount += 1;
                for (let i = 0; i < this.rowFilters.length; i++) {
                    let rowFilterData = this.rowFilters[i];
                    check = this.checkFilters(complaint, rowFilterData);
                    if (check) {
                        this.rowFilters[i].answer[index] += 1;
                    }
                }
            }
        });   // Ends: Logic
        return totalCount;
    }  // Ends: getUpdatedTableDataColumn()

    /* Open Filter Modal */
    openDialog(): void {
        const dialogRef = this.dialog.open(FilterModalComponent, {
            data: {
                complaintTypeList: CommonFunctions.getInstance().deepCopy(this.complaintTypeList),
                statusList: CommonFunctions.getInstance().deepCopy(this.statusList),
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.filtersData) {
                this.isTableUpdated = true;
                let filter = data.filtersData;

                if (this.whereToAdd == 'row') {    /* Add Row Filter */
                    let returnData = this.getTableDataRow(filter);
                    filter["answer"] = returnData["answer"];
                    filter["totalCount"] = returnData["totalCount"];
                    this.rowFilters.push(filter);
                } else {    /* Add Column Filter */
                    let totalCount = this.getTableDataColumn(filter);
                    filter["totalCount"] = totalCount;
                    this.columnFilters.push(filter);
                }
            }
        });
    }  // Ends: openDialog()

    /* Open Filter Modal - For Existing Filters (Row  or  Column) */
    openChangeDialog(filter): void {
        const dialogRef = this.dialog.open(FilterModalComponent, {
            data: {
                complaintTypeList: CommonFunctions.getInstance().deepCopy(this.complaintTypeList),
                statusList: CommonFunctions.getInstance().deepCopy(this.statusList),
                filter: filter,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.filtersData) {
                this.isTableUpdated = true;
                let filtersData = data.filtersData;

                if (filtersData["operation"] == "update") {    /* Update Filter */
                    delete filtersData["operation"];
                    if (this.whereToAdd == 'row') {    /* Update Row */
                        let index = 0;
                        for (let i = 0; i < this.rowFilters.length; i++) {
                            if (this.rowFilters[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }

                        let returnData = this.getTableDataRow(filtersData);
                        filtersData["answer"] = returnData.answer;
                        filtersData["totalCount"] = returnData.totalCount;
                        this.rowFilters[index] = filtersData;
                    } else if (this.whereToAdd === 'col') {    /* Update Column */
                        let index = 0;
                        for (let i = 0; i < this.columnFilters.length; i++) {
                            if (this.columnFilters[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }
                        filtersData["totalCount"] = this.getUpdatedTableDataColumn(filtersData, index);
                        this.columnFilters[index] = filtersData;
                    }
                } else if (filtersData["operation"] == "delete") {    /* Delete Filter */
                    delete filtersData["operation"];
                    if (this.whereToAdd == 'row') {    /* Delete Row */
                        let index = 0;
                        for (let i = 0; i < this.rowFilters.length; i++) {
                            if (this.rowFilters[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }
                        this.rowFilters.splice(index, 1);
                    } else if (this.whereToAdd === 'col') {    /* Delete Column */
                        let index = 0;
                        for (let i = 0; i < this.columnFilters.length; i++) {
                            if (this.columnFilters[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }
                        this.columnFilters.splice(index, 1);
                        for (let i = 0; i < this.rowFilters.length; i++) {
                            this.rowFilters[i]["answer"].splice(index, 1);
                        }
                    }
                }
            }
        });   // Dialog Closed.
    }  // Ends: openChangeDialog()

    /* Open Table Format Name Dialog */
    openSaveFormatDialog(): void {
        const dialogRef = this.dialog.open(FormatTableModalComponent, {
            data: {
                formatName: this.tableFormatTitle,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.name) {
                this.tableFormatTitle = data.name;
                this.serviceAdapter.saveTable();
            }
        });
    }  // Ends: openSaveFormatDialog()

    /* Update Table */
    updateChangesClicked(): void {
        this.isTableUpdated = false;
        this.serviceAdapter.updatetable();
    }  // Ends: updateChangesClicked()

    /* Open Table Format Name Dialog - Save As Clicked */
    saveAsClicked(): void {
        const dialogRef = this.dialog.open(FormatTableModalComponent, {
            data: {
                formatName: "",
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.name) {
                this.tableFormatTitle = data.name;
                this.serviceAdapter.saveTable();
            }
        });
    }  // Ends: saveAsClicked()

    /* Open Delete Table Dialog */
    openDeleteTableModal(): void {
        const dialogRef = this.dialog.open(DeleteTableModalComponent, {
            data: {
                formatName: this.tableFormatTitle,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data["operation"] && data["operation"] == "Delete") {
                this.deleteTable();
            }
        });
    }  // Ends: openDeleteTableModal()

    /* Delete Table */
    deleteTable() {
        this.serviceAdapter.deleteTable();
    }  // Ends: deleteTable()

    /* Create New Table */
    addNewTableClicked() {
        if(this.isTableUpdated) {
            let conformation = confirm("Do you want to update your changes?");
            if (conformation) {
                let operation = "createNew";
                this.serviceAdapter.updatetable(operation);
            } else {
                this.initializeTableDetails();
            }
        } else {
            this.initializeTableDetails();
        }
    }  // Ends: addNewTableClicked()

    /* Get header Values */
    getHeaderValues(): any {
        let headerValues = [];
        headerValues.push('');
        this.columnFilters.forEach((columnFilter)=> {
            headerValues.push(columnFilter.name);
        });
        return headerValues;
    }  // Ends: getHeaderValues()

    /* Get Filter Information */
    getFilterInfo(filter: any): any {
        let filterInfo = [];
        filterInfo.push(filter.name);
        filter.answer.forEach((ans: number) => {
            filterInfo.push(ans);
        });
        return filterInfo;
    }  // Ends: getFilterInfo()

    /* Download the Table */
    downloadList(): void {
        let template: any;
        template = [this.getHeaderValues()];
        this.rowFilters.forEach((rowFilter) => {
            template.push(this.getFilterInfo(rowFilter));
        });
        let fileName: string = this.tableFormatTitle + ".csv";
        this.excelService.downloadFile(template, fileName);
    }  // Ends: downloadList()

    /* Print Table */
    printTable(): void {
        // alert('Functionality needs to be implemented once again');
        let template: any = [];
        this.rowFilters.forEach((rowFilter) => {
            template.push(this.getFilterInfo(rowFilter));
        });

        let headerInfo: any = this.getHeaderValues();

        const value = {
            rowData: template,
            columnData: headerInfo,
            tableName: this.tableFormatTitle,
        };
        this.printService.navigateToPrintRoute(PRINT_COUNT_ALL_TABLE_PARENT_SUPPORT, { user: this.user, value });
    }  // Ends: printTable()
}
