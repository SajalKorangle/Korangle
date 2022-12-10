import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
import { Student } from '@services/modules/student/models/student';
import { StudentSection } from '@services/modules/student/models/student-section';
import { StudentService } from '@services/modules/student/student.service';
import { GenericService } from '@services/generic/generic-service';

@Component({
    selector: 'attendance-report',
    templateUrl: './attendance-report.component.html',
    styleUrls: ['./attendance-report.component.css'],
    providers: [OnlineClassService, ClassService, SubjectService, StudentService, GenericService],
})

export class AttendanceReportComponent implements OnInit {

    user: any;

    serviceAdapter: AttendanceReportServiceAdapter;
    htmlRenderer: AttendanceReportHtmlRenderer;

    userInput: {
        selectedClass?: Classs | null,
        selectedDivision?: Division | null,
        selectedParsedClassSubject?: ParsedClassSubject,
        startDate?: Date;
    } = {
        };

    backendData: {
        studentList: Array<Student>,
        studentSectionList: Array<StudentSection>,
        classList: Array<Classs>,
        divisionList: Array<Division>,
        classSubjectList: Array<ClassSubject>,
        subjectList: Array<Subject>,
        studentAttendance: Array<any>,
        activeSession: any,
    } = {
            studentList: [],
            studentSectionList: [],
            classList: [],
            divisionList: [],
            classSubjectList: [],
            subjectList: [],
            studentAttendance: [],
            activeSession: null
        };

    parsedClassSubjectList: Array<ParsedClassSubject> = [];
    parsedStudentSection: Array<ParsedStudentSection> = [];

    stateKeeper = { isLoading: false };


    constructor(
        public onlineClassService: OnlineClassService,
        public classService: ClassService,
        public subjectService: SubjectService,
        public studentService: StudentService,
        public genericService: GenericService,
        public snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new AttendanceReportHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new AttendanceReportServiceAdapter();
        this.serviceAdapter.initialize(this);
        this.serviceAdapter.initilizeData();
        // console.log('this: ', this);
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
        return this.parsedClassSubjectList.filter(cs => cs.classInstance == this.userInput.selectedClass
            && cs.divisionInstance == this.userInput.selectedDivision);
    }

    validUserInput(): boolean {
        if (!(this.userInput.selectedClass && this.userInput.selectedDivision
            && this.userInput.startDate)) {
            return false;
        }
        const startDate = new Date(this.userInput.startDate);
        return true;
    }

    parseStudentData() {
        this.parsedStudentSection = this.backendData.studentSectionList.map((ss, index) => {
            return {
                index: index + 1,
                ...ss,
                studentInstance: this.backendData.studentList.find(s => s.id == ss.parentStudent),
                classInstance: this.backendData.classList.find(c => c.id == ss.parentClass),
                divisionInstance: this.backendData.divisionList.find(d => d.id == ss.parentDivision),
            };
        });
    }

    getDisplayData() {
        return this.parsedStudentSection;
    }

    getDisplayColumns(): Array<string> {
        let dislayColumns = ['S.No.', 'roll', 'name'];
        this.getFilteredClassSubjectList().forEach(classSubject => {
            dislayColumns.push(classSubject.subjectInstance.name);
        });
        return dislayColumns;
    }

    getAttendance(studentSection: ParsedStudentSection, classSubject: any): number {
        const filteredAttendanceList = this.backendData.studentAttendance.filter(studentAttendance =>
            (studentAttendance.parentStudentSection == studentSection.id) && (studentAttendance.parentClassSubject == classSubject.id));
        return filteredAttendanceList.length;
    }

}


interface ParsedClassSubject extends ClassSubject {
    classInstance: Classs;
    divisionInstance: Division;
    subjectInstance: Subject;
}

interface ParsedStudentSection extends StudentSection {
    index: number;
    studentInstance: Student;
    classInstance: Classs;
    divisionInstance: Division;
}