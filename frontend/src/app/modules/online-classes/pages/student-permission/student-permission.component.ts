import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { StudentPermissionServiceAdapter } from './student-permission.service.adapter';
import { StudentPermissionHtmlRenderer } from './student-permission.html.renderer';
import { StudentPermissionUserInput } from './student-permission.user.input';
import { StudentPermissionBackendData } from './student-permission.backend.data';

import { StudentService } from '@services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';

@Component({
    selector: 'student-permission',
    templateUrl: './student-permission.component.html',
    styleUrls: ['./student-permission.component.css'],
    providers: [
        StudentService,
        ClassService
     ],
})

export class StudentPermissionComponent implements OnInit {

    user: any;

    serviceAdapter: StudentPermissionServiceAdapter;
    htmlRenderer: StudentPermissionHtmlRenderer;
    userInput: StudentPermissionUserInput;
    backendData: StudentPermissionBackendData;

    isLoading: any;

    constructor (
        public studentService: StudentService,
        public classService: ClassService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.userInput = new StudentPermissionUserInput();
        this.userInput.initialize(this);

        this.backendData = new StudentPermissionBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new StudentPermissionHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new StudentPermissionServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initilizeData();
    }

    initilizeHTMLRenderedData():void {
        // Populate Class Division of HTML Rendered
        this.htmlRenderer.classDivisionList = [];
        this.backendData.classList.forEach((classs) => {
            this.backendData.divisionList.forEach((division) => {
                if (
                    this.backendData.studentSectionList.find((studentSection) => {
                        return studentSection.parentClass == classs.id && studentSection.parentDivision == division.id;
                    }) != undefined
                ) {
                    this.htmlRenderer.classDivisionList.push({
                        class: classs,
                        section: division,
                        selected: false,
                    });
                }
            });
        });

        const divisionPerClassCount = {}; // count of divisions in each class
        this.htmlRenderer.classDivisionList.forEach((cd) => {
            if (divisionPerClassCount[cd.class.id]) divisionPerClassCount[cd.class.id] += 1;
            else divisionPerClassCount[cd.class.id] = 1;
        });

        this.htmlRenderer.classDivisionList = this.htmlRenderer.classDivisionList.map((cd) => {
            // showDivision based of division count per class
            if (divisionPerClassCount[cd.class.id] == 1) {
                return { ...cd, showDivision: false };
            } else {
                return { ...cd, showDivision: true };
            }
        });

        // Add student in Studet Section in HTML Rendered
        this.htmlRenderer.studentSectionList = this.backendData.studentSectionList.map(ss=>{
            return {...ss, parentStudent: this.backendData.studentList.find(s=>s.id==ss.parentStudent) };
        });
    }
}
