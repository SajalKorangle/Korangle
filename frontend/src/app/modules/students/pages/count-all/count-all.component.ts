import { Component, OnInit } from '@angular/core';

import { GenericService } from '@services/generic/generic-service';
import { PrintService } from '../../../../print/print-service';
import { ExcelService } from '../../../../excel/excel-service';
import { DataStorage } from '../../../../classes/data-storage';

import { CountAllServiceAdapter } from './count-all.service.adapter';
import { CountAllBackendData } from './count-all.backend.data';
import { CountAllHtmlRenderer } from './count-all.html.renderer';
import { FilterModalComponent } from '@modules/students/component/filter-modal/filter-modal.component';
import { FormatTableModalComponent } from '@modules/students/component/format-table-modal/format-table-modal.component';

import { MatDialog } from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { CommonFunctions } from "../../../../classes/common-functions";


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
    tableActiveId: number = 0;

    tableFormatTitle: string = "";     // Table Name
    whereToAdd: string = "";    // Row  or  Column
    rowFilters: any = [];    // Row List
    columnFilters: any = [];    // Column List

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
        if (!sectionObject) {
            console.log('Error: should have section object');
        }
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

    /* Update Row Data After Column Drag */
    updateRowFiltersAfterColumnDrag(): void {
        for (let i = 0; i < this.rowFilters.length; i++) {
            // initializing the result.
            for (let j = 0; j < this.columnFilters.length; j++) {
                this.rowFilters[i]["answer"][j] = 0;
            }

            // Logic:  first check student with row, and then with column.
            this.studentFullProfileList.forEach((student) => {
                let check = this.checkFilters(student, this.rowFilters[i]);
                if (check) {
                    for (let j = 0; j < this.columnFilters.length; j++) {
                        check = this.checkFilters(student, this.columnFilters[j]);
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
        moveItemInArray(this.rowFilters, event.previousIndex, event.currentIndex);
    }

    /* Will be Called After Dragging of a Column */
    dropColumn(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.columnFilters, event.previousIndex, event.currentIndex);
        this.updateRowFiltersAfterColumnDrag();
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
    }

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
                let age = student.dateOfBirth
                ? Math.floor((new Date(filtersData[filter][0]).getTime() - new Date(student.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                : null;

                if (age) {
                    if (age > filtersData[filter][2] || age < filtersData[filter][1]) {
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

        // Logic:  first check student with row, and then with column.
        this.studentFullProfileList.forEach((student) => {
            let check = this.checkFilters(student, filtersData);
            if (check) {
                totalCount += 1;
                for (let i = 0; i < this.columnFilters.length; i++) {
                    let columnFilterData = this.columnFilters[i];
                    check = this.checkFilters(student, columnFilterData);
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

        // Logic:  first check student with column, and then with row.
        this.studentFullProfileList.forEach((student) => {
            let check = this.checkFilters(student, filtersData);
            if (check) {
                totalCount += 1;
                for (let i = 0; i < this.rowFilters.length; i++) {
                    let rowFilterData = this.rowFilters[i];
                    check = this.checkFilters(student, rowFilterData);
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

        // Logic:  first check student with column, and then with row.
        this.studentFullProfileList.forEach((student) => {
            let check = this.checkFilters(student, filtersData);
            if (check) {
                totalCount += 1;
                for (let i = 0; i < this.rowFilters.length; i++) {
                    let rowFilterData = this.rowFilters[i];
                    check = this.checkFilters(student, rowFilterData);
                    if (check) {
                        this.rowFilters[i].answer[index] += 1;
                    }
                }
            }
        });   // Ends: Logic
        return totalCount;
    }  // Ends: getUpdatedTableDataColumn()

    getFilteredStudentParameterList(): any {
        return this.studentParameterList.filter((x) => x.parameterType === 'FILTER');
    }

    /* Open Filter Modal */
    openDialog(): void {
        const dialogRef = this.dialog.open(FilterModalComponent, {
            data: {
                classSectionList: this.classSectionList,
                studentParameterList: CommonFunctions.getInstance().deepCopy(this.getFilteredStudentParameterList()),
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.filtersData) {
                let filtersData = data.filtersData;
                if (this.whereToAdd === 'row') {  /* Row Filter */
                    let returnData = this.getTableDataRow(filtersData);
                    filtersData["answer"] = returnData.answer;
                    filtersData["totalCount"] = returnData.totalCount;
                    this.rowFilters.push(filtersData);
                } else if (this.whereToAdd === 'col') {  /* Column Filter */
                    filtersData["totalCount"] = this.getTableDataColumn(filtersData);
                    this.columnFilters.push(filtersData);
                }
            } else {
                this.classSectionList.forEach((classs) => {
                    classs.sectionList.forEach((section) => {
                        section.selected = false;
                    });
                });
            }
        });
    }  // Ends: openDialog()

    /* Open Filter Modal - For Existing Filters (Row  or  Column) */
    openChangeDialog(filter): void {
        const dialogRef = this.dialog.open(FilterModalComponent, {
            data: {
                classSectionList: this.classSectionList,
                studentParameterList: CommonFunctions.getInstance().deepCopy(this.getFilteredStudentParameterList()),
                filter: filter,
            }
        });

        // OnClosing of Modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.filtersData) {
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
            } else {
                this.classSectionList.forEach((classs) => {
                    classs.sectionList.forEach((section) => {
                        section.selected = false;
                    });
                });
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

    updateChangesClicked(): void {
        this.serviceAdapter.updatetable();
    }

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

    /* Get header Values */
    getHeaderValues(): any {
        let headerValues = [];
        headerValues.push('');
        this.columnFilters.forEach((columnFilter) => {
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
        let fileName: string = this.tableFormatTitle;
        fileName += ".csv";
        this.excelService.downloadFile(template, fileName);
    }  // Ends: downloadList()

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
        this.rowFilters.forEach((row) => {
            if (row.name.length > textContent.length) {
                textContent = row.name;
            }
        });

        return this.getTextWidthColumn(textContent);
    }  // Ends: getTextWidthRow()
}
