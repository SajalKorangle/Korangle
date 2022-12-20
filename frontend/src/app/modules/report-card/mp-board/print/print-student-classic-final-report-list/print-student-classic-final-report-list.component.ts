import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { PrintService } from '../../../../../print/print-service';

@Component({
    templateUrl: './print-student-classic-final-report-list.component.html',
    styleUrls: ['./print-student-classic-final-report-list.component.css'],
})
export class PrintStudentClassicFinalReportListComponent implements OnInit, OnDestroy, AfterViewChecked {
    user: any;

    viewChecked = true;

    subjectList: any;
    extraFieldList: any;
    studentFinalReportList: any;
    reportCardMapping: any;
    includeProject: any;
    showPrincipalSignature: any;
    classTeacherSignature: any;
    boardList: any;
    sessionList: any;

    marksDecimalPoint: any;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) {}

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user;
        this.subjectList = value['subjectList'];
        this.extraFieldList = value['extraFieldList'];
        this.studentFinalReportList = value['studentFinalReportList'];
        this.reportCardMapping = value['reportCardMapping'];
        this.showPrincipalSignature = value['showPrincipalSignature'];
        this.classTeacherSignature = value['classTeacherSignature'];
        this.boardList = value['boardList'];
        this.sessionList = value['sessionList'];
        this.marksDecimalPoint =
            '1.' + this.reportCardMapping.minimumDecimalPoints.toString() + '-' + this.reportCardMapping.maximumDecimalPoints.toString();
        this.populateIncludeProject();
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.subjectList = null;
            this.extraFieldList = null;
            this.studentFinalReportList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.subjectList = null;
        this.extraFieldList = null;
        this.studentFinalReportList = null;
    }

    populateIncludeProject(): void {
        switch (this.studentFinalReportList[0].className) {
            case 'Class - 6':
            case 'Class - 7':
            case 'Class - 8':
                this.includeProject = true;
                break;
            default:
                this.includeProject = false;
        }
    }

    getSubjectName(subjectId: any): any {
        let result = '';
        this.subjectList.every((subject) => {
            if (subject.id == subjectId) {
                result = subject.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getOverallStudentSubjectMarks(student: any, subject: any, subjectIndex: any): any {
        let result = 0;
        if (subject.mainSubject) {
            result += student.parentExaminationJuly.mainSubjectMarksList[subjectIndex];
            result += student.parentExaminationAugust.mainSubjectMarksList[subjectIndex];
            result += student.parentExaminationSeptember.mainSubjectMarksList[subjectIndex];
            result += student.parentExaminationOctober.mainSubjectMarksList[subjectIndex];
            result += student.parentExaminationHalfYearly.mainSubjectMarksList[subjectIndex];
            result += student.parentExaminationDecember.mainSubjectMarksList[subjectIndex];
            result += student.parentExaminationJanuary.mainSubjectMarksList[subjectIndex];
            result += student.parentExaminationFebruary.mainSubjectMarksList[subjectIndex];
            result += student.parentExaminationFinal.mainSubjectMarksList[subjectIndex];
            if (this.includeProject) {
                result += student.parentExaminationProject.mainSubjectMarksList[subjectIndex];
            }
        } else {
            result += student.parentExaminationJuly.extraSubjectMarksList[subjectIndex];
            result += student.parentExaminationAugust.extraSubjectMarksList[subjectIndex];
            result += student.parentExaminationSeptember.extraSubjectMarksList[subjectIndex];
            result += student.parentExaminationOctober.extraSubjectMarksList[subjectIndex];
            result += student.parentExaminationHalfYearly.extraSubjectMarksList[subjectIndex];
            result += student.parentExaminationDecember.extraSubjectMarksList[subjectIndex];
            result += student.parentExaminationJanuary.extraSubjectMarksList[subjectIndex];
            result += student.parentExaminationFebruary.extraSubjectMarksList[subjectIndex];
            result += student.parentExaminationFinal.extraSubjectMarksList[subjectIndex];
            if (this.includeProject) {
                result += student.parentExaminationProject.extraSubjectMarksList[subjectIndex];
            }
        }
        return result;
    }

    getOverallStudentSubjectMaxMarks(): any {
        if (this.includeProject) {
            return 240;
        } else {
            return 220;
        }
    }

    getGrade(marksObtained: any, maximumMarks: any): any {
        let grade = '';
        let percentage = (marksObtained * 100) / maximumMarks;
        if (percentage >= 75) {
            grade = 'A';
        } else if (percentage >= 60) {
            grade = 'B';
        } else if (percentage >= 45) {
            grade = 'C';
        } else if (percentage >= 33) {
            grade = 'D';
        } else {
            grade = 'E';
        }
        return grade;
    }

    getOverallStudentExtraSubFieldMarks(student: any, index: any): any {
        let result = 0;
        result += student.parentExaminationJuly.extraSubFieldMarksList[index];
        result += student.parentExaminationAugust.extraSubFieldMarksList[index];
        result += student.parentExaminationSeptember.extraSubFieldMarksList[index];
        result += student.parentExaminationOctober.extraSubFieldMarksList[index];
        result += student.parentExaminationHalfYearly.extraSubFieldMarksList[index];
        result += student.parentExaminationDecember.extraSubFieldMarksList[index];
        result += student.parentExaminationJanuary.extraSubFieldMarksList[index];
        result += student.parentExaminationFebruary.extraSubFieldMarksList[index];
        result += student.parentExaminationFinal.extraSubFieldMarksList[index];
        return result;
    }

    getOverallStudentTotalSubjectMarks(student: any): any {
        let result = 0;
        student.mainSubjectList.forEach((item, index) => {
            result += this.getOverallStudentSubjectMarks(student, item, index);
        });
        return result;
    }

    getOverallStudentTotalSubjectMaxMarks(student: any): any {
        return student.mainSubjectList.length * this.getOverallStudentSubjectMaxMarks();
    }

    getOverallStudentTotalExtraFieldMarks(student: any, index1: any): any {
        let result = 0;
        this.extraFieldList[index1].extraSubFieldList.forEach((extraSubField, index2) => {
            result += this.getOverallStudentExtraSubFieldMarks(student, index1 * 5 + index2);
        });
        return result;
    }

    getOverallStudentTotalExtraFieldMaxMarks(index: any): any {
        return this.extraFieldList[index].extraSubFieldList.length * 18;
    }

    getOverallStudentAttendance(student: any): any {
        let result = 0;
        result += student.parentExaminationJuly.attendanceData.attendance;
        result += student.parentExaminationAugust.attendanceData.attendance;
        result += student.parentExaminationSeptember.attendanceData.attendance;
        result += student.parentExaminationOctober.attendanceData.attendance;
        result += student.parentExaminationHalfYearly.attendanceData.attendance;
        result += student.parentExaminationDecember.attendanceData.attendance;
        result += student.parentExaminationJanuary.attendanceData.attendance;
        result += student.parentExaminationFebruary.attendanceData.attendance;
        result += student.parentExaminationFinal.attendanceData.attendance;
        return result;
    }

    getOverallStudentWorkingDays(student: any): any {
        let result = 0;
        result += student.parentExaminationJuly.attendanceData.workingDays;
        result += student.parentExaminationAugust.attendanceData.workingDays;
        result += student.parentExaminationSeptember.attendanceData.workingDays;
        result += student.parentExaminationOctober.attendanceData.workingDays;
        result += student.parentExaminationHalfYearly.attendanceData.workingDays;
        result += student.parentExaminationDecember.attendanceData.workingDays;
        result += student.parentExaminationJanuary.attendanceData.workingDays;
        result += student.parentExaminationFebruary.attendanceData.workingDays;
        result += student.parentExaminationFinal.attendanceData.workingDays;
        return result;
    }

    getOverallStudentMarks(student: any): any {
        return (
            this.getOverallStudentTotalSubjectMarks(student) +
            this.getOverallStudentTotalExtraFieldMarks(student, 0) +
            this.getOverallStudentTotalExtraFieldMarks(student, 1)
        );
    }

    getOverallStudentMaxMarks(student: any): any {
        return (
            this.getOverallStudentTotalSubjectMaxMarks(student) +
            this.getOverallStudentTotalExtraFieldMaxMarks(0) +
            this.getOverallStudentTotalExtraFieldMaxMarks(1)
        );
    }

    getSessionName(sessionId: any): any {
        return this.sessionList.find(session => {
            return session.id == sessionId;
        }).name;
    }

    getNextStep(student: any): any {
        let result = '';
        switch (student.className) {
            case 'Play Group':
                result = 'Promoted to Nursery';
                break;
            case 'Nursery':
                result = 'Promoted to L.K.G.';
                break;
            case 'L.K.G.':
                result = 'Promoted to U.K.G.';
                break;
            case 'U.K.G.':
                result = 'Promoted to Class - 1';
                break;
            case 'Class - 1':
                result = 'Promoted to Class - 2';
                break;
            case 'Class - 2':
                result = 'Promoted to Class - 3';
                break;
            case 'Class - 3':
                result = 'Promoted to Class - 4';
                break;
            case 'Class - 4':
                result = 'Promoted to Class - 5';
                break;
            case 'Class - 5':
                result = 'Promoted to Class - 6';
                break;
            case 'Class - 6':
                result = 'Promoted to Class - 7';
                break;
            case 'Class - 7':
                result = 'Promoted to Class - 8';
                break;
            case 'Class - 8':
                result = 'Promoted to Class - 9';
                break;
            case 'Class - 9':
                result = 'Promoted to Class - 10';
                break;
            case 'Class - 10':
                result = 'Promoted to Class - 11';
                break;
            case 'Class - 11':
                result = 'Promoted to Class - 12';
                break;
            case 'Class - 12':
                result = '';
                break;
        }
        return result;
    }

    getPercentage(marksObtained: any, maxMarks: any): any {
        return (marksObtained / maxMarks) * 100;
    }
}
