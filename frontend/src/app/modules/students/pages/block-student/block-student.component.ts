import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { BlockStudentServiceAdapter } from './block-student.service.adapter';
import { BlockStudentHtmlRenderer } from './block-student.html.renderer';
import { BlockStudentUserInput } from './block-student.user.input';
import { BlockStudentBackendData } from './block-student.backend.data';

import { StudentService } from '@services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';
import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import {TCService} from '@services/modules/tc/tc.service';
import { GenericService } from '@services/generic/generic-service';

@Component({
    selector: 'block-student',
    templateUrl: './block-student.component.html',
    styleUrls: ['./block-student.component.css'],
    providers: [
        StudentService,
        ClassService,
        OnlineClassService,
        TCService,
        GenericService,
    ],
})

export class BlockStudentComponent implements OnInit {

    user: any;

    serviceAdapter: BlockStudentServiceAdapter;
    htmlRenderer: BlockStudentHtmlRenderer;
    userInput: BlockStudentUserInput;
    backendData: BlockStudentBackendData;

    isActiveSession: boolean;

    isLoading: boolean;

    constructor(
        public studentService: StudentService,
        public classService: ClassService,
        public onlineClassService: OnlineClassService,
        public tcService: TCService,
        public genericService: GenericService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.userInput = new BlockStudentUserInput();
        this.userInput.initialize(this);

        this.backendData = new BlockStudentBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new BlockStudentHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new BlockStudentServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initilizeData();
    }

    initilizeHTMLRenderedData(): void {
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
        this.htmlRenderer.studentSectionList = this.backendData.studentSectionList.map(ss => {
            return {
                ...ss, parentStudent: this.backendData.studentList.find(s => s.id == ss.parentStudent),
                selected: !this.backendData.restrictedStudentList.find(rs => rs.parentStudent == ss.parentStudent)
            };
        });
    }
}
