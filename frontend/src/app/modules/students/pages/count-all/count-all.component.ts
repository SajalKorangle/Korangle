import { Component, OnInit } from '@angular/core';

import { ClassService } from '../../../../services/modules/class/class.service';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import { StudentService } from '../../../../services/modules/student/student.service';

import { PrintService } from '../../../../print/print-service';
import { ExcelService } from '../../../../excel/excel-service';
import { DataStorage } from '../../../../classes/data-storage';
import { BusStopService } from '@services/modules/school/bus-stop.service';
import { SchoolService } from '@services/modules/school/school.service';
import { TCService } from './../../../../services/modules/tc/tc.service';

import { CountAllServiceAdapter } from './count-all.service.adapter';
import { CountAllBackendData } from './count-all.backend.data';
import { FilterModalComponent } from '@modules/students/component/filter-modal/filter-modal.component';
import { FormatTableModalComponent } from '@modules/students/component/format-table-modal/format-table-modal.component';

import { MatDialog } from '@angular/material';
import { GenericService } from '@services/generic/generic-service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { CommonFunctions } from "../../../../classes/common-functions";


@Component({
    selector: 'app-count-all',
    templateUrl: './count-all.component.html',
    styleUrls: ['./count-all.component.css'],
    providers: [GenericService, StudentService, StudentOldService, ClassService, ExcelService, BusStopService, SchoolService, TCService],
})
export class CountAllComponent implements OnInit {
    user;
    isLoading = false;
    NULL_CONSTANT = null;

    isTableEditing: Boolean = false;
    tableActiveId: Number = 0;

    tableFormatTitle: string = "";
    whereToAdd = "";
    rowFilters = [];
    columnFilters = [];

    tableList = [];
    classSectionList = [];
    studentFullProfileList = [];
    studentParameterList: any[] = [];
    studentParameterValueList: any[] = [];

    serviceAdapter: CountAllServiceAdapter;
    backendData: CountAllBackendData;

    constructor(
        public genericService: GenericService,
        public studentOldService: StudentOldService,
        public studentService: StudentService,
        public classService: ClassService,
        public excelService: ExcelService,
        public schoolService: SchoolService,
        public printService: PrintService,
        public busStopService: BusStopService,
        public tcService: TCService,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.backendData = new CountAllBackendData();
        this.backendData.initialize(this);

        this.serviceAdapter = new CountAllServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    initializeClassSectionList(classSectionList: any): void {
        this.classSectionList = classSectionList;
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = false;
                section.containsStudent = false;
            });
        });
    }

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
    }

    initializeStudentFullProfileList(studentFullProfileList: any): void {
        this.studentFullProfileList = studentFullProfileList;
        this.studentFullProfileList.forEach((studentFullProfile) => {
            studentFullProfile['sectionObject'] = this.getSectionObject(studentFullProfile.classDbId, studentFullProfile.sectionDbId);
            studentFullProfile['show'] = false;
            studentFullProfile['selectProfile'] = false;
            studentFullProfile['selectDocument'] = false;
            studentFullProfile['newTransferCertificate'] = this.backendData.tcList.find(tc => tc.parentStudent == studentFullProfile.dbId);
        });
    }

    updateRowFiltersAfterColumnDrag() {
        for(let i = 0; i < this.rowFilters.length; i++) {
            for(let j = 0; j < this.columnFilters.length; j++) {
                this.rowFilters[i]["answer"][j] = 0;
            }

            this.studentFullProfileList.forEach((student) => {
                let check = this.checkFilters(student, this.rowFilters[i]);
                if(check) {
                    for(let j = 0; j < this.columnFilters.length; j++) {
                        check = this.checkFilters(student, this.columnFilters[j]);
                        if(check) {
                            this.rowFilters[i]["answer"][j] += 1;
                        }
                    }
                }
            });
        }
    }

    dropRow(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.rowFilters, event.previousIndex, event.currentIndex);
    }

    dropColumn(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.columnFilters, event.previousIndex, event.currentIndex);
        this.updateRowFiltersAfterColumnDrag();
    }

    getParameterValue(student, parameter) {
        try {
            return this.studentParameterValueList.find(
                (x) => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id
            ).value;
        } catch {
            return this.NULL_CONSTANT;
        }
    }

    checkFilters(student, filtersData) {
        let check = true;
        for(const filter in filtersData) {
            if(filter == "selectedClass") {
                let studentClass =  student.className + ", " + student.sectionName;
                if(!filtersData[filter].includes(studentClass)) {
                    check = false;
                    break;
                }
            } else if(filter == "age") {
                let age = student.dateOfBirth
                ? Math.floor((new Date(filtersData[filter][0]).getTime() - new Date(student.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                : null;
                
                if (age) {
                    if (age > filtersData[filter][2] || age < filtersData[filter][1]) {
                        check = false;
                        break;
                    }
                }
            } else if(filter == "category") {
                let category = student.category ? student.category : "NONE";

                if(!filtersData[filter].includes(category)) {
                    check = false;
                    break;
                }
            } else if(filter == "gender") {
                let gender = student.gender ? student.gender : "NONE";
                
                if(!filtersData[filter].includes(gender)) {
                    check = false;
                    break;
                }
            } else if(filter == "admission") {
                let admissionType;

                if(!student.admissionSessionDbId) {
                    admissionType = "NONE";
                } else if (student.admissionSessionDbId === this.user.activeSchool.currentSessionDbId) {
                    admissionType = "New";
                } else {
                    admissionType = "Old";
                }

                if(!filtersData[filter].includes(admissionType)) {
                    check = false;
                    break;
                }
            } else if(filter == "RTE") {
                let rte = student.rte ? student.rte : "NONE";
                if(!filtersData[filter].includes(rte)) {
                    check = false;
                    break;
                }
            } else if(filter == "TC") {
                if (!((filtersData[filter].includes("NO") && !student.parentTransferCertificate && !student.newTransferCertificate)
                    || (filtersData[filter].includes("YES") && (student.parentTransferCertificate || student.newTransferCertificate)))) {
                    check = false;
                    break;
                }
            } else if(filter == "studentParameterList") {
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
    }

    getTableDataRow(filtersData) {
        let answer = [];
        for(let i = 0; i < this.columnFilters.length; i++) {
            answer.push(0);
        }

        console.log("Student: ", this.studentFullProfileList[0]);   
        this.studentFullProfileList.forEach((student) => {
            let check = this.checkFilters(student, filtersData);
            if(check) {
                for(let i = 0; i < this.columnFilters.length; i++) {
                    let columnFilterData = this.columnFilters[i];
                    check = this.checkFilters(student, columnFilterData);
                    if(check) {
                        answer[i] += 1;
                    }
                }
            }
        });
        return answer;
    }

    getTableDataColumn(filtersData) {
        for(let i = 0; i < this.rowFilters.length; i++) {
            this.rowFilters[i].answer.push(0);
        }

        this.studentFullProfileList.forEach((student) => {
            let check = this.checkFilters(student, filtersData);
            if(check) {
                for(let i = 0; i < this.rowFilters.length; i++) {
                    let rowFilterData = this.rowFilters[i];
                    check = this.checkFilters(student, rowFilterData);
                    if(check) {
                        this.rowFilters[i].answer[this.rowFilters[i].answer.length - 1] += 1;
                    }
                }
            }
        });
    }

    getUpdatedTableDataColumn(filtersData, index) {
        for(let i = 0; i < this.rowFilters.length; i++) {
            this.rowFilters[i].answer[index] = 0;
        }

        this.studentFullProfileList.forEach((student) => {
            let check = this.checkFilters(student, filtersData);
            if(check) {
                for(let i = 0; i < this.rowFilters.length; i++) {
                    let rowFilterData = this.rowFilters[i];
                    check = this.checkFilters(student, rowFilterData);
                    if(check) {
                        this.rowFilters[i].answer[index] += 1;
                    }
                }
            }
        });
    }  

    getFilteredStudentParameterList() {
        return this.studentParameterList.filter((x) => x.parameterType === 'FILTER');
    }

    openDialog() {
        const dialogRef = this.dialog.open(FilterModalComponent, {
            data: {
                classSectionList: this.classSectionList,
                studentParameterList: CommonFunctions.getInstance().deepCopy(this.getFilteredStudentParameterList()),
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
            console.log("Closed");
            if(data && data.filtersData) {
                let filtersData = data.filtersData;
                console.log("Filters Data: ", filtersData);
                if(this.whereToAdd === 'row') {
                    let answer = this.getTableDataRow(filtersData);
                    filtersData["answer"] = answer;
                    this.rowFilters.push(filtersData);
                } else if(this.whereToAdd === 'col') {
                    this.columnFilters.push(filtersData);
                    this.getTableDataColumn(filtersData);
                }
            } else {
                this.classSectionList.forEach((classs) => {
                    classs.sectionList.forEach((section) => {
                        section.selected = false;
                    });
                });
            }
        });
    }

    openChangeDialog(filter) {
        const dialogRef = this.dialog.open(FilterModalComponent, {
            data: {
                classSectionList: this.classSectionList,
                studentParameterList: CommonFunctions.getInstance().deepCopy(this.getFilteredStudentParameterList()),
                filter: filter,
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
            console.log("Closed");
            if(data && data.filtersData) {
                let filtersData = data.filtersData;
                console.log("Filters Data: ", filtersData);
                
                if(filtersData["operation"] == "update") {
                    delete filtersData["operation"];
                    if(this.whereToAdd == 'row') {
                        let index = 0;
                        for(let i = 0; i < this.rowFilters.length; i++) {
                            if(this.rowFilters[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }
                        
                        let answer = this.getTableDataRow(filtersData);
                        filtersData["answer"] = answer;
                        this.rowFilters[index] = filtersData;
                    } else if(this.whereToAdd === 'col') {
                        let index = 0;
                        for(let i = 0; i < this.columnFilters.length; i++) {
                            if(this.columnFilters[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }
                        this.columnFilters[index] = filtersData;
                        this.getUpdatedTableDataColumn(filtersData, index);
                    }
                } else if(filtersData["operation"] == "delete") {
                    delete filtersData["operation"];
                    if(this.whereToAdd == 'row') {
                        let index = 0;
                        for(let i = 0; i < this.rowFilters.length; i++) {
                            if(this.rowFilters[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }
                        this.rowFilters.splice(index, 1);
                        console.log("Delete-Row: ", this.rowFilters);
                    } else if(this.whereToAdd === 'col') {
                        let index = 0;
                        for(let i = 0; i < this.columnFilters.length; i++) {
                            if(this.columnFilters[i]["name"] == filter["name"]) {
                                index = i;
                                break;
                            }
                        }
                        this.columnFilters.splice(index, 1);
                        for(let i = 0; i < this.rowFilters.length; i++) {
                            this.rowFilters[i]["answer"].splice(index, 1);
                        }
                        console.log("Delete-Column: ", this.columnFilters);
                    }
                }
            } else {
                this.classSectionList.forEach((classs) => {
                    classs.sectionList.forEach((section) => {
                        section.selected = false;
                    });
                });
            }
        });
    }

    openSaveFormatDialog() {
        const dialogRef = this.dialog.open(FormatTableModalComponent, {
            data: {
                formatName: this.tableFormatTitle,
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
            if(data && data.name) {
                this.tableFormatTitle = data.name;
                this.serviceAdapter.saveTable();
            }
        });
    }

    tableOpenClicked(table) {
        this.isTableEditing = true;
        this.tableActiveId = table["id"];
        this.tableFormatTitle = table.formatName;
        let tableRows = [];
        let tableCols = [];

        Object.entries(table["rows"]).forEach(([key, value]) => {
            tableRows.push(value);
        });

        Object.entries(table["cols"]).forEach(([key, value]) => {
            tableCols.push(value);
        });

        this.columnFilters = tableCols;
        this.rowFilters = tableRows;
    }

    updateChangesClicked() {
        this.serviceAdapter.updatetable();
    }

    saveAsClicked() {
        const dialogRef = this.dialog.open(FormatTableModalComponent, {
            data: {
                formatName: "",
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
            if(data && data.name) {
                this.tableFormatTitle = data.name;
                this.serviceAdapter.saveTable();
            }
        });
    }

    getHeaderValues(): any {
        let headerValues = [];
        headerValues.push('');
        this.columnFilters.forEach((columnFilter)=> {
            headerValues.push(columnFilter.name);
        });
        return headerValues;
    }

    getFilterInfo(filter: any): any {
        let filterInfo = [];
        filterInfo.push(filter.name);
        filter.answer.forEach((ans: number) => {
            filterInfo.push(ans);
        });
        return filterInfo;
    }

    downloadList(): void {
        let template: any;
        template = [this.getHeaderValues()];
        this.rowFilters.forEach((rowFilter) => {
            template.push(this.getFilterInfo(rowFilter));
        });
        let fileName: string = this.tableFormatTitle;
        fileName += ".csv";
        this.excelService.downloadFile(template, fileName);
    }

    getTextWidthColumn(textContent: string) {
        let text = document.createElement("span");
        document.body.appendChild(text);

        text.style.font = "roboto";
        text.style.fontSize = 16 + "px";
        text.style.height = 'auto';
        text.style.width = 'auto';
        text.style.position = 'absolute';
        text.style.whiteSpace = 'no-wrap';
        text.innerHTML = textContent;

        let width = Math.ceil(text.offsetWidth);
        let formattedWidth = width + "px";
        document.body.removeChild(text);
        return formattedWidth;
    }

    getTextWidthRow() {
        let textContent = "+ Row";
        this.rowFilters.forEach((row) => {
            if(row.name.length > textContent.length) {
                textContent = row.name;
            }
        });

        return this.getTextWidthColumn(textContent);
    }
}
