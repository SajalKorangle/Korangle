import { Component, Input, OnInit } from '@angular/core';

import { ExaminationService } from '../../../../../services/modules/examination/examination.service';
import { ClassService } from '../../../../../services/modules/class/class.service';
import { SubjectService } from '../../../../../services/modules/subject/subject.service';
import { AttendanceOldService } from '../../../../../services/modules/attendance/attendance-old.service';

import { ReportCardMpBoardService } from '../../../../../services/modules/report-card/mp-board/report-card-mp-board.service';

import { GradeStudentFieldsServiceAdapter } from './grade-student-fields.service.adapter';
import { StudentService } from '../../../../../services/modules/student/student.service';

import { ChangeDetectorRef } from '@angular/core';
import { DataStorage } from '../../../../../classes/data-storage';

@Component({
    selector: 'grade-student-fields',
    templateUrl: './grade-student-fields.component.html',
    styleUrls: ['./grade-student-fields.component.css'],
    providers: [ExaminationService, ClassService, SubjectService, StudentService, AttendanceOldService, ReportCardMpBoardService],
})
export class GradeStudentFieldsComponent implements OnInit {
    user;

    showTestDetails = false;

    selectedExamination: any;
    selectedClassSection: any;
    selectedField: any;

    examinationList = [];
    classSectionList = [];
    fieldList: any;

    minimumMarks = 1.2;
    maximumMarks = 2.0;

    studentList = [];

    // subjectList: any;

    serviceAdapter: GradeStudentFieldsServiceAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(
        public examinationService: ExaminationService,
        public classService: ClassService,
        public subjectService: SubjectService,
        public studentService: StudentService,
        public attendanceService: AttendanceOldService,
        private cdRef: ChangeDetectorRef,
        public reportCardMpBoardService: ReportCardMpBoardService
    ) {}

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

    getFilteredStudentList(): any {
        return this.studentList.filter((student) => {
            return (
                student.studentSection.parentClass == this.selectedClassSection.class.id &&
                student.studentSection.parentDivision == this.selectedClassSection.section.id
            );
        });
    }

    unpopulatedFieldsLength(): number {
        let number = 0;
        this.getFilteredStudentList().forEach((student) => {
            number += student.subFieldList.filter((subField) => {
                return subField.id == 0;
            }).length;
        });
        return number;
    }
}
