import { Component, Input, OnInit } from '@angular/core';

import { ExaminationService } from '../../../../services/examination.service';
import { ClassService } from '../../../../services/class.service';
import { SubjectService } from '../../../../services/subject.service';
import { AttendanceService } from '../../../attendance/attendance.service';

import { GradeStudentFieldsServiceAdapter } from './grade-student-fields.service.adapter';
import {TEST_TYPE_LIST} from '../../classes/constants';
import {StudentService} from '../../../students/student.service';

import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'grade-student-fields',
    templateUrl: './grade-student-fields.component.html',
    styleUrls: ['./grade-student-fields.component.css'],
    providers: [ ExaminationService, ClassService, SubjectService, StudentService, AttendanceService ],
})

export class GradeStudentFieldsComponent implements OnInit {

    @Input() user;

    showTestDetails = false;

    selectedExamination: any;
    selectedClass: any;
    selectedField: any;

    examinationList: any;
    classSectionList: any;
    fieldList: any;

    studentList: any;

    subjectList: any;

    serviceAdapter: GradeStudentFieldsServiceAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(public examinationService: ExaminationService,
                public classService: ClassService,
                public subjectService: SubjectService,
                public studentService: StudentService,
                public attendanceService: AttendanceService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new GradeStudentFieldsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.showTestDetails = false;
        this.cdRef.detectChanges();
    }

    getStudentName(studentId: any): any {
        let result = '';
        this.studentList.every(item => {
            if (item.dbId === studentId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }

}
