import { Component, Input, OnInit } from '@angular/core';

// import { ExaminationOldService } from '../../../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../../../services/modules/examination/examination.service';
import { ClassService } from '../../../../../services/modules/class/class.service';
import { SubjectService } from '../../../../../services/modules/subject/subject.service';
import { AttendanceOldService } from '../../../../../services/modules/attendance/attendance-old.service';

import { ReportCardMpBoardService } from '../../../../../services/modules/report-card/mp-board/report-card-mp-board.service';

import { GradeStudentFieldsServiceAdapter } from './grade-student-fields.service.adapter';
import {TEST_TYPE_LIST} from '../../../../../classes/constants/test-type';
import {StudentService} from '../../../../../services/modules/student/student.service';

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../../classes/data-storage";

@Component({
    selector: 'grade-student-fields',
    templateUrl: './grade-student-fields.component.html',
    styleUrls: ['./grade-student-fields.component.css'],
    providers: [ ExaminationService, ClassService, SubjectService, StudentService, AttendanceOldService, ReportCardMpBoardService ],
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
                public classService: ClassService,
                public subjectService: SubjectService,
                public studentService: StudentService,
                public attendanceService: AttendanceOldService,
                private cdRef: ChangeDetectorRef,
                public reportCardMpBoardService: ReportCardMpBoardService) {}

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
