import { Component, Input, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../services/examination-old.service';
import { ClassService } from '../../../../services/class.service';
import { SubjectOldService } from '../../../../services/subject-old.service';
import { AttendanceService } from '../../../attendance/attendance.service';

import { GradeStudentFieldsServiceAdapter } from './grade-student-fields.service.adapter';
import {TEST_TYPE_LIST} from '../../classes/constants';
import {StudentOldService} from '../../../students/student-old.service';

import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'grade-student-fields',
    templateUrl: './grade-student-fields.component.html',
    styleUrls: ['./grade-student-fields.component.css'],
    providers: [ ExaminationOldService, ClassService, SubjectOldService, StudentOldService, AttendanceService ],
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

    constructor(public examinationService: ExaminationOldService,
                public classService: ClassService,
                public subjectService: SubjectOldService,
                public studentService: StudentOldService,
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
