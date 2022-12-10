import { Component, OnInit } from '@angular/core';

import { GenerateFinalReportServiceAdapter } from './generate-final-report.service.adapter';

import { ChangeDetectorRef } from '@angular/core';

import { AttendanceService } from '../../../../../services/modules/attendance/attendance.service';

import { PrintService } from '../../../../../print/print-service';
import { DataStorage } from '../../../../../classes/data-storage';

import { ReportCardCbseService } from '../../../../../services/modules/report-card/cbse/report-card-cbse.service';
import { ClassService } from '../../../../../services/modules/class/class.service';
import { StudentService } from '../../../../../services/modules/student/student.service';
import { ExaminationService } from '../../../../../services/modules/examination/examination.service';
import { SubjectService } from '../../../../../services/modules/subject/subject.service';
import { GenericService } from '@services/generic/generic-service';
import { PRINT_STUDENT_JUNIOR_REPORT, PRINT_STUDENT_SENIOR_REPORT } from '../../../../../print/print-routes.constants';

@Component({
    selector: 'generate-final-report',
    templateUrl: './generate-final-report.component.html',
    styleUrls: ['./generate-final-report.component.css'],
    providers: [ReportCardCbseService, ClassService, StudentService, ExaminationService, SubjectService, AttendanceService, GenericService],
})
export class GenerateFinalReportComponent implements OnInit {
    user;

    selectedClassSection = null;

    subjectList = [];
    termList = [];
    extraFieldList = [];
    reportCardMappingList = [];
    classSectionList = [];
    studentSectionList = [];
    studentList = [];
    examinationList = [];

    testList = [];
    studentProfileList = [];
    studentTestList = [];
    studentExtraFieldList = [];
    studentRemarkList = [];
    termStudentAttendanceList = [];
    classSubjectList = [];
    classTeacherSignatureList = [];
    classTeacherSignature = null;

    showPrincipalSignature = true;
    showClassTeacherSignature = true;
    showPromotionStatement = true;
    showAbsentOnZero = false;

    sessionList: any;

    serviceAdapter: GenerateFinalReportServiceAdapter;

    isLoading = true;
    timeout: any;

    constructor(
        public reportCardCbseService: ReportCardCbseService,
        public studentService: StudentService,
        public classService: ClassService,
        public examinationService: ExaminationService,
        public subjectService: SubjectService,
        public attendanceService: AttendanceService,
        public genericService: GenericService,
        private cdRef: ChangeDetectorRef,
        private printService: PrintService
    ) {}

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
            termList: this.termList,
            extraFieldList: this.extraFieldList,
            selectedClassSection: this.selectedClassSection,
            studentSectionList: this.getSelectedStudentList(),
            showSection: this.showSectionName(this.selectedClassSection),
            testList: this.testList,
            studentList: this.studentList.filter((student) => {
                return (
                    this.getSelectedStudentList().find((studentSection) => {
                        return studentSection.parentStudent == student.id;
                    }) != undefined
                );
            }),
            studentTestList: this.studentTestList,
            studentExtraFieldList: this.studentExtraFieldList,
            studentRemarkList: this.studentRemarkList,
            termStudentAttendanceList: this.termStudentAttendanceList,
            reportCardMappingList: this.reportCardMappingList,
            subjectList: this.subjectList,
            classSubjectList: this.classSubjectList,
            showPrincipalSignature: this.showPrincipalSignature,
            classTeacherSignature: this.classTeacherSignature,
            showPromotionStatement: this.showPromotionStatement,
            showAbsentOnZero: this.showAbsentOnZero,
            sessionList: this.sessionList,
        };
        let printRoute: string;

        if (this.selectedClassSection.class.orderNumber >= 5) {
            printRoute = PRINT_STUDENT_JUNIOR_REPORT;
        } else {
            printRoute = PRINT_STUDENT_SENIOR_REPORT;
        }

        this.printService.navigateToPrintRoute(printRoute, { user: this.user, value: data });
        alert('This may take a while');
    }

    onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('paged!', event);
        }, 100);
    }

    getStudent(studentSection: any): any {
        return this.studentList.find((student) => {
            return student.id == studentSection.parentStudent;
        });
    }

    showSectionName(classSection: any): boolean {
        return (
            this.classSectionList.filter((item) => {
                return item.class.id == classSection.class.id;
            }).length > 1
        );
    }

    getFilteredStudentSectionList(): any {
        return this.studentSectionList.filter((studentSection) => {
            return (
                studentSection.parentClass == this.selectedClassSection.class.id &&
                studentSection.parentDivision == this.selectedClassSection.section.id
            );
        });
    }

    getSelectedStudentList(): any {
        return this.getFilteredStudentSectionList().filter((studentSection) => {
            return studentSection.selected == true;
        });
    }

    getSelectedStudentNumber(): number {
        return this.getSelectedStudentList().length;
    }

    getSelectedStudentsValue(from: number, to: number): boolean {
        let result = true;
        this.getFilteredStudentSectionList()
            .slice(from, to)
            .every((studentSection) => {
                if (!studentSection.selected) {
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
            this.getFilteredStudentSectionList()
                .slice(from, to)
                .forEach((student) => {
                    student.selected = true;
                });
        }
        this.cdRef.detectChanges();
    }

    unselectAllStudents(): void {
        this.getFilteredStudentSectionList().forEach((student) => {
            student.selected = false;
        });
        this.cdRef.detectChanges();
    }
}
