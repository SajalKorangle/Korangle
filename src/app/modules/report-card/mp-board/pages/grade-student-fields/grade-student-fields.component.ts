import { Component, Input, OnInit } from '@angular/core';

// import { ExaminationOldService } from '../../../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../../../services/modules/examination/examination.service';
import { ClassOldService } from '../../../../../services/modules/class/class-old.service';
import { SubjectOldService } from '../../../../../services/modules/subject/subject-old.service';
import { AttendanceOldService } from '../../../../../services/modules/attendance/attendance-old.service';

import { GradeStudentFieldsServiceAdapter } from './grade-student-fields.service.adapter';
import {TEST_TYPE_LIST} from '../../../../../classes/constants/test-type';
import {StudentOldService} from '../../../../../services/modules/student/student-old.service';

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../../classes/data-storage";

@Component({
    selector: 'grade-student-fields',
    templateUrl: './grade-student-fields.component.html',
    styleUrls: ['./grade-student-fields.component.css'],
    providers: [ ExaminationService, ClassOldService, SubjectOldService, StudentOldService, AttendanceOldService ],
})

export class GradeStudentFieldsComponent implements OnInit {

    user;

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
                public classService: ClassOldService,
                public subjectService: SubjectOldService,
                public studentService: StudentOldService,
                public attendanceService: AttendanceOldService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
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
