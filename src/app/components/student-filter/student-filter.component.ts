import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { StudentService } from '../../modules/students/student.service';
import {SchoolService} from '../../services/school.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Student} from '../../classes/student';

@Component({
    selector: 'student-filter',
    templateUrl: './student-filter.component.html',
    styleUrls: ['./student-filter.component.css'],
    providers: [ StudentService, SchoolService ],
})

export class StudentFilterComponent implements OnInit {

    @Input() user;

    @Input() sessionChange = true;

    @Input() studentTcGenerated = false;

    @Output() onStudentSelected = new EventEmitter<any>();

    @Output() onStudentLoading = new EventEmitter<boolean>();

    @Output() onSessionChange = new EventEmitter<boolean>();

    myControl = new FormControl();

    studentList = [];
    filteredStudentList: any;

    selectedSession: any;
    sessionList: any;

    isLoading = false;

    constructor (private studentService: StudentService,
                 private schoolService: SchoolService) { }

    ngOnInit(): void {
        this.handleOnStudentLoading(true);
        const request_student_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
            schoolDbId: this.user.activeSchool.dbId,
        };
        const request_class_section_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        Promise.all([
            this.schoolService.getSessionList(this.user.jwt),
            this.studentService.getStudentMiniProfileList(request_student_data, this.user.jwt),
        ]).then(value => {
            this.handleOnStudentLoading(false);
            this.populateSessionList(value[0]);
            this.populateStudentList(value[1]);
        });
    }

    populateSessionList(sessionList: any): void {
        this.sessionList = sessionList;
        this.sessionList.every(session => {
            if (session.dbId === this.user.activeSchool.currentSessionDbId) {
                this.selectedSession = session;
                return false;
            }
            return true;
        });
    }

    populateStudentList(studentList: any): void {
        if (this.studentTcGenerated) {
            this.studentList = studentList;
        } else {
            this.studentList = studentList.filter(student => {
                if (student.parentTransferCertificate) {
                    return false;
                }
                return true;
            });
        }
        this.studentList.forEach(student => {
            student.showSectionName = this.showSectionName(student.className);
        });
        this.filteredStudentList = this.myControl.valueChanges.pipe(
            map(value => typeof value === 'string' ? value: (value as any).name),
            map(name => this.filter(name.toString()))
        );
    }

    showSectionName(className: any): boolean {
        let result = false;
        this.studentList.every(student => {
            if (student.className === className && student.sectionName !== 'Section - A') {
                result = true;
            }
            if (result) {
                return false;
            } else {
                return true;
            }
        });
        return result;
    }

    filter(value: string): any {
        if (value === null || value === '') {
            return [];
        }
        return this.studentList.filter( student => {
            if (student.name.toLowerCase().indexOf(value.toLowerCase()) === 0) {
                return true;
            } else if (student.scholarNumber && student.scholarNumber.toLowerCase().indexOf(value.toLowerCase()) === 0) {
                return true;
            }
            return false;
        });
    }

    displayFn(student?: any) {
        if (student) {
            return student.name
                + (student.scholarNumber? ' (' + student.scholarNumber + ')': '')
                + ', ' + student.className
                + (student.showSectionName ? ', ' + student.sectionName : '');
        } else {
            return '';
        }
    }

    handleStudentSelection(student: any): void {
        this.onStudentSelected.emit(student);
    }

    handleOnStudentLoading(value: boolean): void {
        this.isLoading = value;
        this.onStudentLoading.emit(value);
    }

    handleSessionChange(): void {
        this.studentList = [];
        this.handleOnStudentLoading(true);
        this.handleStudentSelection(null);
        this.onSessionChange.emit(this.selectedSession);
        const request_student_data = {
            sessionDbId: this.selectedSession.dbId,
            schoolDbId: this.user.activeSchool.dbId,
        };
        this.studentService.getStudentMiniProfileList(request_student_data, this.user.jwt).then( studentList => {
            this.handleOnStudentLoading(false);
            this.populateStudentList(studentList);
        });
    }

}
