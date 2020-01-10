import { Component, Input, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../../../services/modules/examination/examination.service';

import { GenerateFinalReportServiceAdapter } from './generate-final-report.service.adapter';
import {REPORT_CARD_TYPE_LIST} from '../../classes/constants';

import { ChangeDetectorRef } from '@angular/core';
import {ClassOldService} from '../../../../../services/modules/class/class-old.service';
import {StudentOldService} from '../../../../../services/modules/student/student-old.service';
import {SubjectOldService} from '../../../../../services/modules/subject/subject-old.service';
import {AttendanceOldService} from '../../../../../services/modules/attendance/attendance-old.service';
import { PRINT_STUDENT_NINTH_FINAL_REPORT, PRINT_STUDENT_ELEVENTH_FINAL_REPORT, PRINT_STUDENT_CLASSIC_FINAL_REPORT, PRINT_STUDENT_ELEGANT_FINAL_REPORT, PRINT_STUDENT_COMPREHENSIVE_FINAL_REPORT } from '../../../../../print/print-routes.constants';
import { PrintService } from '../../../../../print/print-service';
import {DataStorage} from "../../../../../classes/data-storage";
import {SchoolService} from "../../../../../services/modules/school/school.service";

@Component({
    selector: 'generate-final-report',
    templateUrl: './generate-final-report.component.html',
    styleUrls: ['./generate-final-report.component.css'],
    providers: [ ExaminationOldService,ExaminationService, ClassOldService, StudentOldService, SubjectOldService, AttendanceOldService, SchoolService ],
})

export class GenerateFinalReportComponent implements OnInit {

    user;

    reportCardTypeList = REPORT_CARD_TYPE_LIST;

    showPrinicipalSignature = true;

    reportCardMapping: any;
    classSectionStudentList = [];

    filteredStudentList = [];

    subjectList = [];
    extraFieldList = [];
    studentFinalReportCardList = [];
    boardList: any;

    serviceAdapter: GenerateFinalReportServiceAdapter;

    isLoading = true;
    timeout: any;

    constructor(public examinationOldService: ExaminationOldService,
                public examinationService : ExaminationService,
                public classService: ClassOldService,
                public studentService: StudentOldService,
                public subjectService: SubjectOldService,
                public attendanceService: AttendanceOldService,
                public schoolService: SchoolService,
                private cdRef: ChangeDetectorRef,
                private printService: PrintService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new GenerateFinalReportServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    printStudentFinalReport(): void {
        let data = {
            'extraFieldList': this.extraFieldList,
            'subjectList': this.subjectList,
            'studentFinalReportList': this.studentFinalReportCardList,
            'reportCardMapping': this.reportCardMapping,
            'showPrincipalSignature': this.showPrinicipalSignature,
            'boardList': this.boardList,
        };
        let selectedClassSection = this.getSelectedClassSection();
        let printRoute : string;
        
        if (selectedClassSection.className == 'Class - 9') {
            printRoute = PRINT_STUDENT_NINTH_FINAL_REPORT;
        } else if( selectedClassSection.className == 'Class - 11'){
            printRoute = PRINT_STUDENT_ELEVENTH_FINAL_REPORT;
        } else if (this.reportCardMapping.reportCardType == REPORT_CARD_TYPE_LIST[2]) {
            printRoute = PRINT_STUDENT_COMPREHENSIVE_FINAL_REPORT;
        } else if (this.reportCardMapping.reportCardType == REPORT_CARD_TYPE_LIST[1]) {
            printRoute = PRINT_STUDENT_ELEGANT_FINAL_REPORT;
        } else {
            printRoute = PRINT_STUDENT_CLASSIC_FINAL_REPORT;
        }

        this.printService.navigateToPrintRoute(printRoute, {user: this.user, value: data});
        alert('This may take a while');
    }

    showSectionName(className: any): boolean {
        let result = false;
        this.classSectionStudentList.every(classs => {
            if (classs.name == className) {
                if (classs.sectionList.length > 1) {
                    result = true;
                    return false;
                }
            }
            return true;
        });
        return result;
    }

    unselectAllClasses(): void {
        this.classSectionStudentList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = false;
                });
            }
        );
    }

    getSelectedStudentsValue(from: number, to: number): boolean {
        let result = true;
        this.filteredStudentList.slice(from, to).every(student => {
            if (!student.selected) {
                result = false;
                return false;
            }
            return true;
        });
        return result;
    }

    selectStudents(from: number, to: number, value: boolean): void {
        this.unselectAllStudents();
        if (value) {
            this.filteredStudentList.slice(from, to).forEach(student => {
                student.selected = true;
            });
        }
        this.cdRef.detectChanges();
    }

    unselectAllStudents(): void {
        this.filteredStudentList.forEach(student => {
            student.selected = false;
        });
        this.cdRef.detectChanges();
    }

    handleStudentDisplay(): void {
        this.filteredStudentList = [];
        this.classSectionStudentList.every(classs => {
            let result = true;
            classs.sectionList.every(section => {
                if (section.selected) {
                    this.filteredStudentList = section.studentList;
                    result = false;
                    return false;
                }
                return true;
            });
            return result;
        });
        this.cdRef.detectChanges();
    }

    getSelectedClassSection(): any {
        let selectedClassSection = null;
        this.classSectionStudentList.every(classs => {
            let result = true;
            classs.sectionList.every(section => {
                if (section.selected) {
                    selectedClassSection = {
                        'className': classs.name,
                        'classDbId': classs.dbId,
                        'sectionName': section.name,
                        'sectionDbId': section.id,
                    };
                    result = false;
                    return false;
                }
                return true;
            });
            return result;
        });
        return selectedClassSection;
    }

    getSelectedStudentNumber(): number {
        let result = 0;
        this.filteredStudentList.forEach(student => {
            if (student.selected) {
                ++result;
            }
        });
        return result;
    }

    updateRowValue(row: any, value: boolean): void {
        row.selected = value;
        this.cdRef.detectChanges();
    }

    getRowClass(row): any {
        return {
            'hoverRow': true,
        };
    }

    getRowHeight(row) {
        return 50;
    }

    onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('paged!', event);
        }, 100);
    }

}
