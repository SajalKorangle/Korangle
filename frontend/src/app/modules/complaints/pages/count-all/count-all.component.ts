import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";

import { MatDialog } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonFunctions } from "../../../../classes/common-functions";

import { ExcelService } from '../../../../excel/excel-service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_COUNT_ALL_TABLE_COMPLAINTS } from '../../../../print/print-routes.constants';

import { CountAllServiceAdapter } from './count-all.service.adapter';
import { CountAllHtmlRenderer } from './count-all.html.renderer';
import { FilterModalComponent } from '@modules/complaints/pages/count-all/component/filter-modal/filter-modal.component';
import { TableNameModalComponent } from '@modules/complaints/pages/count-all/component/table-name-modal/table-name-modal.component';
import { ShowComplaintListModalComponent } from '@modules/complaints/pages/count-all/component/show-complaint-list-modal/show-complaint-list-modal.component';
import { DeleteTableModalComponent } from '@modules/complaints/component/delete-table-modal/delete-table-modal.component';

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

    nullComplaintType = {
        id: null,
        defaultText: '',
        name: 'None',
        parentSchoolComplaintStatusDefault: null,
        parentSchool: null,
        selected: false,
    };

    nullStatus = {
        id: null,
        name: 'None',
        parentSchool: null,
        selected: false,
    };

    isTableEditing: boolean = false;
    isTableUpdated: boolean = false;
    tableActiveId: number = 0;
    tableActiveIdx: number = 0;

    tableFormatTitle: string = "";     // Table Name
    oldTableFormatTitle: string = "";     // Old Table Name
    whereToAdd: string = "";    // Row  or  Column
    rowFilterList: any = [];    // Row List
    columnFilterList: any = [];    // Column List

    tableList: any = [];
    complaintTypeList: any = [];
    statusList: any = [];
    complaintList: any = [];
    studentList: any = [];

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
        this.complaintTypeList = [];
        this.complaintTypeList.push(this.nullComplaintType);

        complaintTypeList.forEach((complaintType) => {
            complaintType["selected"] = false;
            this.complaintTypeList.push(complaintType);
        });

    }  // Ends: initializecomplaintTypeList()

    /* Initialize Status List */
    initializeStatusList(statusList) {
        this.statusList = [];
        this.statusList.push(this.nullStatus);

        statusList.forEach((status) => {
            status["selected"] = false;
            this.statusList.push(status);
        });
    }  // Ends: initializeStatusList()

    /* Initialize Student Full Profile List */
    initializeStudentFullProfileList(studentList, studentSectionList) {
        this.studentList = [];
        for (let i = 0; i < studentSectionList.length; i++) {
            for (let j = 0; j < studentList.length; j++) {
                if (studentSectionList[i].parentStudent === studentList[j].id) {

                    let student_data = {};
                    let student_object = studentList[j];
                    let student_section_object = studentSectionList;

                    student_data['name'] = student_object.name;
                    student_data['dbId'] = student_object.id;

                    this.studentList.push(student_data);
                    break;
                }
            }
        }
    }  // Ends: initializeStudentFullProfileList()

    /* Update Table Data */
    updateTableData(tableRows, tableCols) {
        /* Update the column-headers */
        for (let i = 0; i < tableCols.length; i++) {
            let filter = tableCols[i];

            if (filter["complaintTypeList"]) {
                let complaintTypeIdList = filter["complaintTypeList"];
                let newComplaintTypeIdList = [];

                complaintTypeIdList.forEach((complaintType) => {
                    if (this.checkComplaintTypeExist(complaintType)) {
                        newComplaintTypeIdList.push(complaintType);
                    }
                });

                filter["complaintTypeList"] = newComplaintTypeIdList;
            }

            if (filter["statusList"]) {
                let statusIdList = filter["statusList"];
                let newStatusIdList = [];

                statusIdList.forEach((status) => {
                    if (this.checkStatusExist(status)) {
                        newStatusIdList.push(status);
                    }
                });

                filter["statusList"] = newStatusIdList;
            }

            if (filter["startDateType"]) {
                let startDateType = filter["startDateType"];
                let endDateType = filter["endDateType"];

                if (startDateType == "1st of Ongoing Month") {
                    let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
                    [month, date, year] = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString("en-US").split("/");

                    if (parseInt(date) < 10) {
                        date = "0" + date;
                    }
                    if (parseInt(month) < 10) {
                        month = "0" + month;
                    }

                    filter["startDate"] = year + "-" + month + "-" + date;
                }

                if (endDateType) {
                    let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");

                    if (parseInt(date) < 10) {
                        date = "0" + date;
                    }
                    if (parseInt(month) < 10) {
                        month = "0" + month;
                    }

                    filter["endDate"] = year + "-" + month + "-" + date;
                }
            }
        }

        /* Update the rows */
        for (let i = 0; i < tableRows.length; i++) {
            let filter = tableRows[i];

            if (filter["complaintTypeList"]) {
                let complaintTypeIdList = filter["complaintTypeList"];
                let newComplaintTypeIdList = [];

                complaintTypeIdList.forEach((complaintType) => {
                    if (this.checkComplaintTypeExist(complaintType)) {
                        newComplaintTypeIdList.push(complaintType);
                    }
                });

                filter["complaintTypeList"] = newComplaintTypeIdList;
            }

            if (filter["statusList"]) {
                let statusIdList = filter["statusList"];
                let newStatusIdList = [];

                statusIdList.forEach((status) => {
                    if (this.checkStatusExist(status)) {
                        newStatusIdList.push(status);
                    }
                });

                filter["statusList"] = newStatusIdList;
            }

            if (filter["startDateType"]) {
                let startDateType = filter["startDateType"];
                let endDateType = filter["endDateType"];

                if (startDateType == "1st of Ongoing Month") {
                    let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
                    [month, date, year] = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString("en-US").split("/");

                    if (parseInt(date) < 10) {
                        date = "0" + date;
                    }
                    if (parseInt(month) < 10) {
                        month = "0" + month;
                    }

                    filter["startDate"] = year + "-" + month + "-" + date;
                }

                if (endDateType) {
                    let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");

                    if (parseInt(date) < 10) {
                        date = "0" + date;
                    }
                    if (parseInt(month) < 10) {
                        month = "0" + month;
                    }

                    filter["endDate"] = year + "-" + month + "-" + date;
                }
            }
        }
    }  // Ends: updateTableData()

    /* Initialize Table List */
    initializeTableList(tableList) {
        for (let idx = 0; idx < tableList.length; idx++) {
            let table = tableList[idx];
            let tableRows = [];
            let tableCols = [];

            Object.entries(table["cols"]).forEach(([key, value]) => {
                tableCols.push(value);
            });

            Object.entries(table["rows"]).forEach(([key, value]) => {
                tableRows.push(value);
            });
            this.updateTableData(tableRows, tableCols);
        }

        this.tableList = tableList;
        this.serviceAdapter.updateTableList();
    }  // Ends: initializeTableList()

    /* Initialize Table Details */
    initializeTableDetails() {
        this.isTableUpdated = false;
        this.isTableEditing = false;
        this.tableActiveId = null;
        this.tableActiveIdx = null;
        this.tableFormatTitle = "";
        this.oldTableFormatTitle = "";
        this.columnFilterList = [];
        this.rowFilterList = [];
    }  // Ends: initializeTableDetails()

    /* Will be Called After Dragging of a Row */
    dropRow(event: CdkDragDrop<string[]>): void {
        this.isTableUpdated = true;
        moveItemInArray(this.rowFilterList, event.previousIndex, event.currentIndex);
    }  // Ends: dropRow()

    /* Will be Called After Dragging of a Column */
    dropColumn(event: CdkDragDrop<string[]>): void {
        this.isTableUpdated = true;
        moveItemInArray(this.columnFilterList, event.previousIndex, event.currentIndex);
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

                let [cMonth, cDate, cYear] = new Date(complaint.dateSent).toLocaleDateString("en-US").split("/");
                let complaintDate = new Date(parseInt(cYear), parseInt(cMonth) - 1, parseInt(cDate), 12, 0, 0).getTime();

                let [sMonth, sDate, sYear] = new Date(filtersData["startDate"]).toLocaleDateString("en-US").split("/");
                let filterStartDate = new Date(parseInt(sYear), parseInt(sMonth) - 1, parseInt(sDate), 12, 0, 0).getTime();

                let [eMonth, eDate, eYear] = new Date(filtersData["endDate"]).toLocaleDateString("en-US").split("/");
                let filterEndDate = new Date(parseInt(eYear), parseInt(eMonth) - 1, parseInt(eDate), 12, 0, 0).getTime();

                if (complaintDate < filterStartDate || complaintDate > filterEndDate) {
                    check = false;
                    break;
                }

            }
        }
        return check;
    }  // Ends: checkFilters()

    /* Get Filtered Complaint List */
    getFilteredComplaintList(rowFilter, columnFilter) {
        let filteredComplaintList = [];
        this.complaintList.forEach((complaint) => {
            let check = this.checkFilters(complaint, rowFilter);
            if (check) {
                check = this.checkFilters(complaint, columnFilter);
                if (check) {
                    filteredComplaintList.push(complaint);
                }
            }
        });

        return filteredComplaintList;
    }  // Ends: getFilteredComplaintList()

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
                    this.rowFilterList.push(filter);
                } else {    /* Add Column Filter */
                    this.columnFilterList.push(filter);
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
                        for (let i = 0; i < this.rowFilterList.length; i++) {
                            if (this.rowFilterList[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }
                        this.rowFilterList[index] = filtersData;
                    } else if (this.whereToAdd === 'col') {    /* Update Column */
                        let index = 0;
                        for (let i = 0; i < this.columnFilterList.length; i++) {
                            if (this.columnFilterList[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }
                        this.columnFilterList[index] = filtersData;
                    }
                } else if (filtersData["operation"] == "delete") {    /* Delete Filter */
                    delete filtersData["operation"];
                    if (this.whereToAdd == 'row') {    /* Delete Row */
                        let index = 0;
                        for (let i = 0; i < this.rowFilterList.length; i++) {
                            if (this.rowFilterList[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }
                        this.rowFilterList.splice(index, 1);
                    } else if (this.whereToAdd === 'col') {    /* Delete Column */
                        let index = 0;
                        for (let i = 0; i < this.columnFilterList.length; i++) {
                            if (this.columnFilterList[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }
                        this.columnFilterList.splice(index, 1);
                    }
                }
            }
        });   // Dialog Closed.
    }  // Ends: openChangeDialog()

    /* Open Table Format Name Dialog */
    openSaveFormatDialog(): void {
        const dialogRef = this.dialog.open(TableNameModalComponent, {
            data: {
                formatName: "",
                tableList: this.tableList,
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

    /* Open Table Format Name Dialog */
    openShowComplaintListDialog(rowFilter, columnFilter): void {
        const dialogRef = this.dialog.open(ShowComplaintListModalComponent, {
            data: {
                complaintList: this.getFilteredComplaintList(rowFilter, columnFilter),
                statusList: this.statusList,
                complaintTypeList: this.complaintTypeList,
                studentList: this.studentList,
            }
        });
    }  // Ends: openShowComplaintListDialog()

    /* Update Table */
    updateChangesClicked(): void {

        if (!this.tableFormatTitle.toString().trim()) {
            alert("Please enter the table name.");
            return;
        }

        if (!this.htmlRenderer.checkTableName()) {
            alert("Table name must be unique.");
            return;
        }

        this.isTableUpdated = false;
        this.serviceAdapter.updatetable();
    }  // Ends: updateChangesClicked()

    /* Open Table Format Name Dialog - Save As Clicked */
    saveAsClicked(): void {
        const dialogRef = this.dialog.open(TableNameModalComponent, {
            data: {
                formatName: "",
                tableList: this.tableList,
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

    /* Get header Values */
    getHeaderValues(): any {
        let headerValues = [];
        headerValues.push('');
        this.columnFilterList.forEach((columnFilter) => {
            let filterTotalCount = this.htmlRenderer.getFilterTotalCount(columnFilter);
            let filterName = columnFilter.name + " (" + filterTotalCount + ")";
            headerValues.push(filterName);
        });
        return headerValues;
    }  // Ends: getHeaderValues()

    /* Get Filter Information */
    getFilterInfo(filter: any): any {
        let filterInfo = [];

        let filterTotalCount = this.htmlRenderer.getFilterTotalCount(filter);
        let filterName = filter.name + " (" + filterTotalCount + ")";
        filterInfo.push(filterName);

        this.columnFilterList.forEach((columnFilter) => {
           filterInfo.push(this.htmlRenderer.getIntersectionCount(filter, columnFilter));
        });
        return filterInfo;
    }  // Ends: getFilterInfo()

    /* Download the Table */
    downloadList(): void {
        let template: any;
        template = [this.getHeaderValues()];
        this.rowFilterList.forEach((rowFilter) => {
            template.push(this.getFilterInfo(rowFilter));
        });
        let fileName: string = this.tableFormatTitle.toString().trim() + ".csv";
        this.excelService.downloadFile(template, fileName);
    }  // Ends: downloadList()

    /* Print Table */
    printTable(): void {
        // alert('Functionality needs to be implemented once again');
        let template: any = [];
        this.rowFilterList.forEach((rowFilter) => {
            template.push(this.getFilterInfo(rowFilter));
        });

        let headerInfo: any = this.getHeaderValues();

        const value = {
            rowData: template,
            columnData: headerInfo,
            tableName: this.tableFormatTitle,
        };
        this.printService.navigateToPrintRoute(PRINT_COUNT_ALL_TABLE_COMPLAINTS, { user: this.user, value });
    }  // Ends: printTable()

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
        alert("Table deleted successfully.");
    }  // Ends: deleteTable()

    /* Create New Table */
    addNewTableClicked() {
        if (!this.isTableEditing && (this.rowFilterList.length + this.columnFilterList.length) > 0) {
            let confirmation = confirm("Do you want to save the current table?");
            if (confirmation) {
                const dialogRef = this.dialog.open(TableNameModalComponent, {
                    data: {
                        formatName: "",
                        tableList: this.tableList,
                    }
                });

                // OnClosing of Modal.
                dialogRef.afterClosed().subscribe((data) => {
                    if (data && data.name) {
                        this.tableFormatTitle = data.name;
                        this.serviceAdapter.saveTable("initializeTableDetails");
                    }
                });
            } else {
                this.initializeTableDetails();
            }
            this.isTableUpdated = false;
            return;
        }

        if (this.isTableUpdated) {
            let confirmation = confirm("Do you want to update your changes?");
            if (confirmation) {
                let operation = "createNew";
                this.isTableUpdated = false;
                this.serviceAdapter.updatetable(operation);
            } else {
                this.isTableUpdated = false;
                this.serviceAdapter.restoreOldtable(this.tableActiveId, this.tableActiveIdx);
            }
        } else {
            this.initializeTableDetails();
        }
    }  // Ends: addNewTableClicked()

    /* Open Clicked Table */
    openTableClicked(table, idx) {

        if (!this.isTableEditing && (this.rowFilterList.length + this.columnFilterList.length) > 0) {
            let confirmation = confirm("Do you want to save the current table?");
            if (confirmation) {
                const dialogRef = this.dialog.open(TableNameModalComponent, {
                    data: {
                        formatName: "",
                        tableList: this.tableList,
                    }
                });

                // OnClosing of Modal.
                dialogRef.afterClosed().subscribe((data) => {
                    if (data && data.name) {
                        this.tableFormatTitle = data.name;
                        this.serviceAdapter.saveTable("openTable", table, idx);
                    }
                });
            } else {
                this.htmlRenderer.tableOpenClicked(table, idx);
            }
            this.isTableUpdated = false;
            return;
        }

        if (this.isTableUpdated) {
            let confirmation = confirm("Do you want to update your changes?");
            if (confirmation) {
                let operation = "";
                this.serviceAdapter.updatetable(operation, table, idx);
            } else {
                this.serviceAdapter.restoreOldtable(this.tableActiveId, this.tableActiveIdx, table, idx);
            }
        } else {
            this.htmlRenderer.tableOpenClicked(table, idx);
        }
        this.isTableUpdated = false;
    }  // Ends: openTableClicked()

    checkComplaintTypeExist(complaintTypeId) {
        let ans = false;
        this.complaintTypeList.forEach((complaintType) => {
            if (complaintType.id == complaintTypeId) {
                ans = true;
            }
        });

        return ans;
    }

    checkStatusExist(statusId) {
        let ans = false;
        this.statusList.forEach((status) => {
            if (status.id == statusId) {
                ans = true;
            }
        });

        return ans;
    }
}
