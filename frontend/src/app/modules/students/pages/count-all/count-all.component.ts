import { Component, OnInit } from '@angular/core';

import { GenericService } from '@services/generic/generic-service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_COUNT_ALL_TABLE } from '../../../../print/print-routes.constants';
import { ExcelService } from '../../../../excel/excel-service';
import { DataStorage } from '../../../../classes/data-storage';

import { CountAllServiceAdapter } from './count-all.service.adapter';
import { CountAllBackendData } from './count-all.backend.data';
import { CountAllHtmlRenderer } from './count-all.html.renderer';
import { FilterModalComponent } from '@modules/students/pages/count-all/component/filter-modal/filter-modal.component';
import { FormatTableModalComponent } from '@modules/students/pages/count-all/component/format-table-modal/format-table-modal.component';
import { ShowStudentListModalComponent } from '@modules/students/pages/count-all/component/show-student-list-modal/show-student-list-modal.component';
import { DeleteTableModalComponent } from '@modules/students/pages/count-all/component/delete-table-modal/delete-table-modal.component';

import { MatDialog } from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { CommonFunctions } from "../../../../classes/common-functions";

import { getAge } from "../../common/common-functions";

@Component({
    selector: 'app-count-all',
    templateUrl: './count-all.component.html',
    styleUrls: ['./count-all.component.css'],
    providers: [GenericService, ExcelService],
})
export class CountAllComponent implements OnInit {
    user;
    isLoading: boolean = false;
    NULL_CONSTANT = null;

    isTableEditing: boolean = false;
    isTableUpdated: boolean = false;
    tableActiveId: number = null;
    tableActiveIdx: number = null;

    tableFormatTitle: string = "";     // Table Name
    oldTableFormatTitle: string = "";     // Old Table Name
    whereToAdd: string = "";    // Row  or  Column
    rowFilterList: any = [];    // Row List
    columnFilterList: any = [];    // Column List

    tableList: any = [];
    classSectionList: any = [];
    studentFullProfileList: any = [];
    studentParameterList: any[] = [];
    studentParameterValueList: any[] = [];

    serviceAdapter: CountAllServiceAdapter;
    backendData: CountAllBackendData;
    htmlRenderer: CountAllHtmlRenderer;

    constructor(
        public genericService: GenericService,
        public excelService: ExcelService,
        public printService: PrintService,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.backendData = new CountAllBackendData();
        this.backendData.initialize(this);

        this.serviceAdapter = new CountAllServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new CountAllHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    /* Initialize Class-Section List */
    initializeClassSectionList(classSectionList: any): void {
        this.classSectionList = classSectionList;
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = false;
                section.containsStudent = false;
            });
        });
    }  // Ends: initializeClassSectionList()

    /* Get Section Objects */
    getSectionObject(classDbId: any, sectionDbId: number): any {
        let sectionObject = null;
        this.classSectionList.every((classs) => {
            classs.sectionList.every((section) => {
                if (sectionDbId === section.id && classDbId === classs.id) {
                    sectionObject = section;
                    section.containsStudent = true;
                    return false;
                }
                return true;
            });
            if (sectionObject) {
                return false;
            }
            return true;
        });
        return sectionObject;
    }  // Ends: getSectionObject()

    /* Initialize Student Full Profile List */
    initializeStudentFullProfileList(studentFullProfileList: any): void {
        this.studentFullProfileList = studentFullProfileList;
        this.studentFullProfileList.forEach((studentFullProfile) => {
            studentFullProfile['sectionObject'] = this.getSectionObject(studentFullProfile.classDbId, studentFullProfile.sectionDbId);
            studentFullProfile['show'] = false;
            studentFullProfile['selectProfile'] = false;
            studentFullProfile['selectDocument'] = false;
            studentFullProfile['newTransferCertificate'] = this.backendData.tcList.find(tc => tc.parentStudent == studentFullProfile.dbId);
        });
    }  // Ends: initializeStudentFullProfileList()

    /* Get the index of custom filter */
    getFilterParameterIdx(filterValues, filter) {
        let filterIdx = -1;
        for (let idx = 0; idx < filterValues.length; idx++) {
            if (filterValues[idx].name == filter.name) {
                filterIdx = idx;
            }
        }

        return filterIdx;
    }  // Ends: getFilterParameterIdx()

    /* Update Table Data */
    updateTableData(tableRows, tableCols) {

        let studentParameterList = this.getFilteredStudentParameterList();

        /* Update the column-headers */
        for (let i = 0; i < tableCols.length; i++) {

            /* Update Custom Parameters */
            let newStudentParameterList = [];
            let idx1 = 0, idx2 = 0, len1 = tableCols[i].studentParameterList.length, len2 = studentParameterList.length;

            /* Starts: Merge Two studentParameterList */
            while (idx1 < len1 && idx2 < len2) {
                if (tableCols[i].studentParameterList[idx1].id == studentParameterList[idx2].id) {

                    let filterValueList = [];
                    let studentParameter = CommonFunctions.getInstance().deepCopy(studentParameterList[idx2]);

                    studentParameter.filterValues.forEach((filter) => {
                        let filterParameterIdx = this.getFilterParameterIdx(tableCols[i].studentParameterList[idx1].filterValues, filter);

                        if (filterParameterIdx == -1) {
                            filterValueList.push(filter);
                        } else {
                            filterValueList.push(tableCols[i].studentParameterList[idx1].filterValues[filterParameterIdx]);
                        }
                    });

                    studentParameter.filterValues = filterValueList;
                    studentParameter.showNone = tableCols[i].studentParameterList[idx1].showNone;
                    newStudentParameterList.push(studentParameter);
                    idx1++;
                    idx2++;
                } else if (tableCols[i].studentParameterList[idx1].id > studentParameterList[idx2].id) {
                    let studentParameter = CommonFunctions.getInstance().deepCopy(studentParameterList[idx2]);
                    newStudentParameterList.push(studentParameter);
                    idx2++;
                } else {
                    idx1++;
                }
            }

            while (idx2 < len2) {
                let studentParameter = CommonFunctions.getInstance().deepCopy(studentParameterList[idx2]);
                newStudentParameterList.push(studentParameter);
                idx2++;
            }
            /* Ends: Merge Two studentParameterList */

            tableCols[i].studentParameterList = newStudentParameterList;

            /* Initialize category */
            if (tableCols[i]["category"]) {
                let category = tableCols[i]["category"];
                let newCategory = [];

                if (category.includes("SC")) {
                    newCategory.push("SC");
                }
                if (category.includes("ST")) {
                    newCategory.push("ST");
                }
                if (category.includes("OBC")) {
                    newCategory.push("OBC");
                }
                if (category.includes("GEN") || category.includes("Gen.")) {
                    newCategory.push("Gen.");
                }
                if (category.includes("NONE")) {
                    newCategory.push("NONE");
                }

                tableCols[i]["category"] = newCategory;
            }   //  Ends: Initialize category
        }

        /* Update the rows */
        for (let i = 0; i < tableRows.length; i++) {

            /* Update Custom Parameters */
            let newStudentParameterList = [];
            let idx1 = 0, idx2 = 0, len1 = tableRows[i].studentParameterList.length, len2 = studentParameterList.length;

            /* Starts: Merge Two studentParameterList */
            while (idx1 < len1 && idx2 < len2) {
                if (tableRows[i].studentParameterList[idx1].id == studentParameterList[idx2].id) {

                    let filterValueList = [];
                    let studentParameter = CommonFunctions.getInstance().deepCopy(studentParameterList[idx2]);

                    studentParameter.filterValues.forEach((filter) => {
                        let filterParameterIdx = this.getFilterParameterIdx(tableRows[i].studentParameterList[idx1].filterValues, filter);

                        if (filterParameterIdx == -1) {
                            filterValueList.push(filter);
                        } else {
                            filterValueList.push(tableRows[i].studentParameterList[idx1].filterValues[filterParameterIdx]);
                        }
                    });

                    studentParameter.filterValues = filterValueList;
                    studentParameter.showNone = tableRows[i].studentParameterList[idx1].showNone;
                    newStudentParameterList.push(studentParameter);
                    idx1++;
                    idx2++;
                } else if (tableRows[i].studentParameterList[idx1].id > studentParameterList[idx2].id) {
                    let studentParameter = CommonFunctions.getInstance().deepCopy(studentParameterList[idx2]);
                    newStudentParameterList.push(studentParameter);
                    idx2++;
                } else {
                    idx1++;
                }
            }

            while (idx2 < len2) {
                let studentParameter = CommonFunctions.getInstance().deepCopy(studentParameterList[idx2]);
                newStudentParameterList.push(studentParameter);
                idx2++;
            }
            /* Starts: Merge Two studentParameterList */

            tableRows[i].studentParameterList = newStudentParameterList;

            /* Initialize category */
            if (tableRows[i]["category"]) {
                let category = tableRows[i]["category"];
                let newCategory = [];

                if (category.includes("SC")) {
                    newCategory.push("SC");
                }
                if (category.includes("ST")) {
                    newCategory.push("ST");
                }
                if (category.includes("OBC")) {
                    newCategory.push("OBC");
                }
                if (category.includes("GEN") || category.includes("Gen.")) {
                    newCategory.push("Gen.");
                }
                if (category.includes("NONE")) {
                    newCategory.push("NONE");
                }

                tableRows[i]["category"] = newCategory;
            }   //  Ends: Initialize category
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
    }

    /* Will be Called After Dragging of a Column */
    dropColumn(event: CdkDragDrop<string[]>): void {
        this.isTableUpdated = true;
        moveItemInArray(this.columnFilterList, event.previousIndex, event.currentIndex);
        // this.updaterowFilterListAfterColumnDrag();
    }

    /* Get Value of Custom Parameter */
    getParameterValue(student, parameter): any {
        try {
            return this.studentParameterValueList.find(
                (x) => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id
            ).value;
        } catch {
            return this.NULL_CONSTANT;
        }
    }  // Ends: getParameterValue()

    /* Check Applied set of Filters on a Student */
    checkFilters(student, filtersData): any {
        let check = true;
        for (const filter in filtersData) {

            if (filter == "selectedClass") {  /* Class Check */
                let studentClass =  student.className + ", " + student.sectionName;
                if (!filtersData[filter].includes(studentClass)) {
                    check = false;
                    break;
                }
            } else if (filter == "age") {  /* Age Check */
                let age = null;

                if (student.dateOfBirth) {
                    age = getAge(filtersData[filter][0], student.dateOfBirth);
                }

                /* Min-Age check */
                if (filtersData[filter][1] != null && !isNaN(filtersData[filter][1])) {
                    if (age == null) {
                        check = false;
                        break;
                    } else if (age < filtersData[filter][1]) {
                        check = false;
                        break;
                    }
                }

                /* Max-Age check */
                if (filtersData[filter][2] != null && !isNaN(filtersData[filter][2])) {
                    if (age == null) {
                        check = false;
                        break;
                    } else if (age > filtersData[filter][2]) {
                        check = false;
                        break;
                    }
                }

            } else if (filter == "category") {  /* Category Check */
                let category = student.category ? student.category : "NONE";

                if (!filtersData[filter].includes(category)) {
                    check = false;
                    break;
                }
            } else if (filter == "gender") {  /* Gender Check */
                let gender = student.gender ? student.gender : "NONE";

                if (!filtersData[filter].includes(gender)) {
                    check = false;
                    break;
                }
            } else if (filter == "admission") {  /* Admission Check */
                let admissionType;

                if (!student.admissionSessionDbId) {
                    admissionType = "NONE";
                } else if (student.admissionSessionDbId === this.user.activeSchool.currentSessionDbId) {
                    admissionType = "New";
                } else {
                    admissionType = "Old";
                }

                if (!filtersData[filter].includes(admissionType)) {
                    check = false;
                    break;
                }
            } else if (filter == "RTE") {  /* RTE Check */
                let rte = student.rte ? student.rte : "NONE";
                if (!filtersData[filter].includes(rte)) {
                    check = false;
                    break;
                }
            } else if (filter == "TC") {  /* TC Check */
                if (!((filtersData[filter].includes("NO") && !student.parentTransferCertificate && !student.newTransferCertificate)
                    || (filtersData[filter].includes("YES") && (student.parentTransferCertificate || student.newTransferCertificate)))) {
                    check = false;
                    break;
                }
            } else if (filter == "studentParameterList") {  /* Custom Paramter Check */
                let studentParameterList = filtersData[filter];
                for (let parameter of studentParameterList) {
                    let flag = parameter.showNone;
                    parameter.filterValues.forEach((filter) => {
                        flag = flag || filter.show;
                    });

                    if (flag) {
                        let parameterValue = this.getParameterValue(student, parameter);
                        if (parameterValue === this.NULL_CONSTANT && parameter.showNone) {
                        } else if (
                            !parameter.filterValues
                                .filter((filter) => filter.show)
                                .map((filter) => filter.name)
                                .includes(parameterValue)
                        ) {
                            check = false;
                            break;
                        }
                    }
                }

                if (!check) {
                    break;
                }
            }
        }
        return check;
    }  // Ends: checkFilters()

    /* Get Filtered Student Parameter List */
    getFilteredStudentParameterList(): any {
        return this.studentParameterList.filter((x) => x.parameterType === 'FILTER').sort((a, b) => a.id - b.id);
    }  // Ends: getFilteredStudentParameterList()

    /* Get Filtered Student List */
    getFilteredStudentList(rowFilter, columnFilter) {
        let studentList = [];
        this.studentFullProfileList.forEach((student) => {
            let check = this.checkFilters(student, rowFilter);
            if (check) {
                check = this.checkFilters(student, columnFilter);
                if (check) {
                    studentList.push(student);
                }
            }
        });

        return studentList;
    }  // Ends: getFilteredStudentList()

    /* Open Filter Modal */
    openDialog(): void {
        const dialogRef = this.dialog.open(FilterModalComponent, {
            data: {
                classSectionList: CommonFunctions.getInstance().deepCopy(this.classSectionList),
                studentParameterList: CommonFunctions.getInstance().deepCopy(this.getFilteredStudentParameterList()),
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.filtersData) {
                this.isTableUpdated = true;
                let filtersData = data.filtersData;
                if (this.whereToAdd === 'row') {  /* Row Filter */
                    this.rowFilterList.push(filtersData);
                } else if (this.whereToAdd === 'col') {  /* Column Filter */
                    this.columnFilterList.push(filtersData);
                }
            }
        });
    }  // Ends: openDialog()

    /* Open Filter Modal - For Existing Filters (Row  or  Column) */
    openChangeDialog(filter): void {
        const dialogRef = this.dialog.open(FilterModalComponent, {
            data: {
                classSectionList: CommonFunctions.getInstance().deepCopy(this.classSectionList),
                studentParameterList: CommonFunctions.getInstance().deepCopy(this.getFilteredStudentParameterList()),
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
        const dialogRef = this.dialog.open(FormatTableModalComponent, {
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
    openShowStudentListDialog(rowFilter, columnFilter): void {
        const dialogRef = this.dialog.open(ShowStudentListModalComponent, {
            data: {
                studentList: this.getFilteredStudentList(rowFilter, columnFilter),
            }
        });
    }  // Ends: openShowStudentListDialog()

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
    }

    /* Open Table Format Name Dialog - Save As Clicked */
    saveAsClicked(): void {
        const dialogRef = this.dialog.open(FormatTableModalComponent, {
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
        let fileName: string = this.tableFormatTitle;
        fileName += ".csv";
        this.excelService.downloadFile(template, fileName);
    }  // Ends: downloadList()

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
        this.printService.navigateToPrintRoute(PRINT_COUNT_ALL_TABLE, { user: this.user, value });
    }

    /* Get Width of Column */
    getTextWidthColumn(textContent: string): any {
        let text = document.createElement("span");
        document.body.appendChild(text);

        text.style.font = "roboto";
        text.style.fontSize = 16 + "px";
        text.style.position = 'absolute';
        text.style.whiteSpace = 'no-wrap';
        text.innerHTML = textContent;

        let width = Math.ceil(text.offsetWidth);
        let formattedWidth = width + "px";
        document.body.removeChild(text);
        return formattedWidth;
    }  // Ends: getTextWidthColumn()

    /* Get Width of 1st Column */
    getTextWidthRow(): any {
        let textContent = "+ Row";
        this.rowFilterList.forEach((row) => {
            if (row.name.length > textContent.length) {
                textContent = row.name;
            }
        });

        return this.getTextWidthColumn(textContent);
    }  // Ends: getTextWidthRow()

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
            let conformation = confirm("Do you want to save the current table?");
            if (conformation) {
                const dialogRef = this.dialog.open(FormatTableModalComponent, {
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
            let conformation = confirm("Do you want to update your changes?");
            if (conformation) {
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
            let conformation = confirm("Do you want to save the current table?");
            if (conformation) {
                const dialogRef = this.dialog.open(FormatTableModalComponent, {
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
            let conformation = confirm("Do you want to update your changes?");
            if (conformation) {
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
}
