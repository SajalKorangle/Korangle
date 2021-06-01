import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { AttendanceReportServiceAdapter } from './attendance-report.service.adapter';
import { AttendanceReportHtmlRenderer } from './attendance-report.html.renderer';

import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { ClassService } from '@services/modules/class/class.service';
import { SubjectService } from '@services/modules/subject/subject.service';

import { Classs } from '@services/modules/class/models/classs';
import { Division } from '@services/modules/class/models/division';
import { ClassSubject } from '@services/modules/subject/models/class-subject';
import { Subject } from '@services/modules/subject/models/subject';

@Component({
    selector: 'attendance-report',
    templateUrl: './attendance-report.component.html',
    styleUrls: ['./attendance-report.component.css'],
    providers: [OnlineClassService, ClassService, SubjectService],
})

export class AttendanceReportComponent implements OnInit {

    user: any;

    serviceAdapter: AttendanceReportServiceAdapter;
    htmlRenderer: AttendanceReportHtmlRenderer;

    userInput: {
        selectedClass?: Classs | null,
        selectedDivision?: Division | null,
        selectedParsedClassSubject?: ParsedClassSubject,
    } = {
        };

    backendData: {
        classList: Array<Classs>,
        divisionList: Array<Division>,
        classSubjectList: Array<ClassSubject>,
        subjectList: Array<Subject>,
        studentAttendance: Array<any>,
    } = {
            classList: [],
            divisionList: [],
            classSubjectList: [],
            subjectList: [],
            studentAttendance: [],
        };

    parsedClassSubjectList: Array<ParsedClassSubject> = [];

    stateKeeper = { isLoading: false };


    constructor(
        public onlineClassService: OnlineClassService,
        public classService: ClassService,
        public subjectService: SubjectService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new AttendanceReportHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new AttendanceReportServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initilizeData();
        console.log('this: ', this);
    }

    populateInitilizationData(): void {
        this.parsedClassSubjectList = this.backendData.classSubjectList.map(classSubject => {
            return {
                ...classSubject,
                classInstance: this.backendData.classList.find(c => c.id == classSubject.parentClass),
                divisionInstance: this.backendData.divisionList.find(d => d.id == classSubject.parentDivision),
                subjectInstance: this.backendData.subjectList.find(s => s.id == classSubject.parentSubject),
            };
        });
    }

    getFilteredClassSubjectList(): Array<ParsedClassSubject> {
        return this.parsedClassSubjectList.filter(cs => cs.classInstance == this.userInput.selectedClass && cs.divisionInstance == this.userInput.selectedDivision);
    }

}


interface ParsedClassSubject extends ClassSubject {
    classInstance: Classs;
    divisionInstance: Division;
    subjectInstance: Subject;
}