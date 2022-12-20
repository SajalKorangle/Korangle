import { Component, Input, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { SubjectOldService } from '../../../../services/modules/subject/subject-old.service';

import { PrintMarksheetServiceAdapter } from './print-marksheet.service.adapter';
import { TEST_TYPE_LIST } from '../../../../classes/constants/test-type';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';

import { ChangeDetectorRef } from '@angular/core';
import { PrintService } from '../../../../print/print-service';
import { PRINT_STUDENT_MARKSHEET } from '../../print/print-routes.constants';
import { DataStorage } from '../../../../classes/data-storage';
import { SchoolService } from '../../../../services/modules/school/school.service';
import { GenericService } from '@services/generic/generic-service';

@Component({
    selector: 'examination-print-marksheet',
    templateUrl: './print-marksheet.component.html',
    styleUrls: ['./print-marksheet.component.css'],
    providers: [ExaminationOldService, ClassService, SubjectOldService, StudentOldService, SchoolService, ExaminationService, GenericService],
})
export class PrintMarksheetComponent implements OnInit {
    user;

    showTestDetails = false;

    selectedExamination: any;
    examinationClassSectionList: any;

    student_full_profile_list: any;

    subjectList: any;

    testTypeList = TEST_TYPE_LIST;

    boardList;

    sessionList;

    serviceAdapter: PrintMarksheetServiceAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(
        public examinationOldService: ExaminationOldService,
        public examinationService: ExaminationService,
        public classService: ClassService,
        public subjectService: SubjectOldService,
        public studentService: StudentOldService,
        public schoolService: SchoolService,
        public genericService: GenericService,
        private cdRef: ChangeDetectorRef,
        private printService: PrintService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new PrintMarksheetServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.showTestDetails = false;
        this.cdRef.detectChanges();
    }

    getStudentName(studentId: any): any {
        let result = '';
        this.student_full_profile_list.every((item) => {
            if (item.dbId === studentId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getFilteredStudentList(list: any): any {
        return list.filter((item) => {
            if (item.parentTransferCertificate === null) {
                return true;
            }
            return false;
        });
    }

    printMarksheet(): void {
        let value = {
            examination: this.selectedExamination,
            boardList: this.boardList,
            sessionList: this.sessionList,
        };
        this.printService.navigateToPrintRoute(PRINT_STUDENT_MARKSHEET, { user: this.user, value: value });
        alert('This may take a while');
    }
}
