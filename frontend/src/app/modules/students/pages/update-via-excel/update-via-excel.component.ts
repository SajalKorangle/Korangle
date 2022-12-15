import { Component, OnInit } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';

import { MatDialog } from '@angular/material';

import { UpdateViaExcelServiceAdapter } from './update-via-excel.service.adapter';
import { UpdateViaExcelHtmlRenderer } from './update-via-excel.html.renderer';


@Component({
  selector: 'app-update-via-excel',
  templateUrl: './update-via-excel.component.html',
  styleUrls: ['./update-via-excel.component.css'],
})
export class UpdateViaExcelComponent implements OnInit {
    user;
    NULL_CONSTANT = null;
    isLoading: boolean = false;

    activeTab: string = "download-template";

    displayStudentNumber: number = 0;

    classList: any = [];
    sectionList: any = [];
    classSectionList: any = [];
    studentFullProfileList: any = [];
    studentSectionList: any = [];
    tcList: any = [];

    reader: FileReader = new FileReader();

    excelDataFromUser: any = [];

    serviceAdapter: UpdateViaExcelServiceAdapter;
    htmlRenderer: UpdateViaExcelHtmlRenderer;

    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new UpdateViaExcelServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlRenderer = new UpdateViaExcelHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);
    }

    /* Initialize Class-Section List */
    initializeClassSectionList(): void {
        this.classSectionList = [];
        this.classList.forEach((classs) => {
            this.sectionList.forEach((section) => {
                let classSection = {};
                classSection["parentClassId"] = classs.id;
                classSection["parentClassName"] = classs.name;
                classSection["parentSectionId"] = section.id;
                classSection["parentSectionName"] = section.name;
                classSection["selected"] = false;
                classSection["containsStudent"] = false;

                this.classSectionList.push(classSection);
            });
        });
    }  //  Ends: initializeClassSectionList()

    /* Get Section Objects */
    getSectionObject(parentClass: any, parentDivision: number): any {
        let sectionObject = null;

        this.classSectionList.forEach((classSection) => {
            if (classSection.parentClassId == parentClass && classSection.parentSectionId == parentDivision) {
                sectionObject = classSection;
                classSection.containsStudent = true;
            }
        });
        return sectionObject;
    }  // Ends: getSectionObject()

    /* Initialize Student Full Profile List */
    initializeStudentFullProfileList(studentFullProfileList: any): void {
        this.studentFullProfileList = studentFullProfileList;
        this.studentFullProfileList.forEach((studentFullProfile) => {
            studentFullProfile['sectionObject'] = this.getSectionObject(studentFullProfile.parentClass, studentFullProfile.parentDivision);
            studentFullProfile['show'] = false;
            studentFullProfile['serialNumber'] = 0;
            studentFullProfile['newTransferCertificate'] = this.tcList.find(tc => tc.parentStudent == studentFullProfile.id);
        });
        this.handleStudentDisplay();
    }  // Ends: initializeStudentFullProfileList()

  /* Set Active Tab */
    setActiveTab(tabName) {
        this.activeTab = tabName;
    }  //  Ends: setActiveTab()

    /* Select All Classes */
    selectAllClasses() {
        this.classSectionList.forEach((classSection) => {
            classSection.selected = true;
        });
        this.handleStudentDisplay();
    }  //  Ends: selectAllClasses()

    /* Unselect All Classes */
    unselectAllClasses() {
        this.classSectionList.forEach((classSection) => {
            classSection.selected = false;
        });
        this.handleStudentDisplay();
    }  //  Ends: unselectAllClasses()

    /* Check visibility of student */
    handleStudentDisplay() {
        let serialNumber = 1;
        this.displayStudentNumber = 0;

        this.studentFullProfileList.forEach((student) => {
            /* Class-Section Check */
            if (!student.sectionObject.selected) {
                student.show = false;
                return;
            }

            this.displayStudentNumber++;
            student.serialNumber = serialNumber++;
            student.show = true;
        });
    }  //  Ends: handleStudentDisplay()
}
