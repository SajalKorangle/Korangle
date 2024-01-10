import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { ATTENDANCE_STATUS_LIST } from '../../../../attendance/classes/constants';
import { PrintService } from '../../../../../print/print-service';

@Component({
    templateUrl: './print-student-junior-report-list.component.html',
    styleUrls: ['./print-student-junior-report-list.component.css'],
})
export class PrintStudentJuniorReportListComponent implements OnInit, OnDestroy, AfterViewChecked {
    user: any;

    viewChecked = true;

    termList: any;
    extraFieldList: any;
    selectedClassSection: any;
    studentSectionList: any;
    showSection: any;
    testList: any;
    studentList: any;
    studentTestList: any;
    studentExtraFieldList: any;
    studentRemarkList: any;
    termStudentAttendanceList: any;
    reportCardMappingList: any;
    subjectList: any;
    classSubjectList: any;
    showPrincipalSignature: any;
    classTeacherSignature: any;
    showPromotionStatement: any;
    showAbsentOnZero: any;

    sessionList: any;

    absentValue = 'Abs.';
    attendance_status_list = ATTENDANCE_STATUS_LIST;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) {}

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user;

        console.log(value);

        this.termList = value['termList'];
        this.extraFieldList = value['extraFieldList'];
        this.selectedClassSection = value['selectedClassSection'];
        this.studentSectionList = value['studentSectionList'];
        this.showSection = value['showSection'];
        this.testList = value['testList'];
        this.studentList = value['studentList'];
        this.studentTestList = value['studentTestList'];
        this.studentExtraFieldList = value['studentExtraFieldList'];
        this.studentRemarkList = value['studentRemarkList'];
        this.termStudentAttendanceList = value['termStudentAttendanceList'];
        this.reportCardMappingList = value['reportCardMappingList'];
        this.subjectList = value['subjectList'];
        this.classSubjectList = value['classSubjectList'];
        this.showPrincipalSignature = value['showPrincipalSignature'];
        this.classTeacherSignature = value['classTeacherSignature'];
        this.showPromotionStatement = value['showPromotionStatement'];
        this.showAbsentOnZero = value['showAbsentOnZero'];
        this.sessionList = value['sessionList'];
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.subjectList = null;
        this.extraFieldList = null;
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

    getDate(): any {
        return new Date();
    }

    getStudentRollNo(student: any): any {
        return this.studentSectionList.find((studentSection) => {
            return studentSection.parentStudent == student.id;
        }).rollNumber;
    }

    getStudentRemark(student: any): any {
        let studentRemark = this.studentRemarkList.find((studentRemark) => {
            return studentRemark.parentStudent == student.id;
        });
        if (studentRemark) {
            return studentRemark.remark;
        } else {
            return '';
        }
    }

    getSessionName(sessionId: any): any {
        return this.sessionList.find(session => {
            return session.id == sessionId;
        }).name;
    }

    getExaminationMarks(student: any, classSubject: any, examinationId: any, baseMarks: any): any {
        let testTypeList = [];
        let filteredTestList = this.testList.filter((test) => {
            return (
                test.parentExamination == examinationId &&
                test.parentSubject == classSubject.parentSubject &&
                test.parentClass == classSubject.parentClass &&
                test.parentDivision == classSubject.parentDivision
            );
        });
        filteredTestList.forEach((test) => {
            testTypeList.push(test.testType);
        });
        let maximumMarks = filteredTestList.reduce((total, a) => {
            return total + Number(a.maximumMarks);
        }, 0);
        if (maximumMarks == 0) {
            console.log('Maximum Marks is coming to be zero');
            return 0;
        }
        let studentMarks = this.studentTestList
            .filter((studentTest) => {
                return (
                    studentTest.parentExamination == examinationId &&
                    studentTest.parentSubject == classSubject.parentSubject &&
                    testTypeList.includes(studentTest.testType) &&
                    studentTest.parentStudent == student.id
                );
            })
            .reduce((total, a) => {
                return total + parseFloat(a.marksObtained);
            }, 0);
        return (studentMarks * baseMarks) / maximumMarks;
    }

    getPeriodicTestMarks(student: any, classSubject: any, term: any, handleAbsent = false): any {
        let examinationId = this.reportCardMappingList.find((reportCardMapping) => {
            return reportCardMapping.parentTerm == term.id;
        }).parentExaminationPeriodicTest;
        let examinationMarks = this.getExaminationMarks(student, classSubject, examinationId, 10);
        return handleAbsent ? (examinationMarks == 0 ? this.absentValue : examinationMarks) : examinationMarks;
    }

    getNoteBookMarks(student: any, classSubject: any, term: any, handleAbsent = false): any {
        let examinationId = this.reportCardMappingList.find((reportCardMapping) => {
            return reportCardMapping.parentTerm == term.id;
        }).parentExaminationNoteBook;
        let examinationMarks = this.getExaminationMarks(student, classSubject, examinationId, 5);
        return handleAbsent ? (examinationMarks == 0 ? this.absentValue : examinationMarks) : examinationMarks;
    }

    getSubEnrichmentMarks(student: any, classSubject: any, term: any, handleAbsent = false): any {
        let examinationId = this.reportCardMappingList.find((reportCardMapping) => {
            return reportCardMapping.parentTerm == term.id;
        }).parentExaminationSubEnrichment;
        let examinationMarks = this.getExaminationMarks(student, classSubject, examinationId, 5);
        return handleAbsent ? (examinationMarks == 0 ? this.absentValue : examinationMarks) : examinationMarks;
    }

    getFinalTermMarks(student: any, classSubject: any, term: any, handleAbsent = false): any {
        let examinationId = this.reportCardMappingList.find((reportCardMapping) => {
            return reportCardMapping.parentTerm == term.id;
        }).parentExaminationFinalTerm;
        let examinationMarks = this.getExaminationMarks(student, classSubject, examinationId, 80);
        return handleAbsent ? (examinationMarks == 0 ? this.absentValue : examinationMarks) : examinationMarks;
    }

    getOverallMarks(student: any, classSubject: any, term: any): any {
        return (
            this.getPeriodicTestMarks(student, classSubject, term) +
            this.getNoteBookMarks(student, classSubject, term) +
            this.getSubEnrichmentMarks(student, classSubject, term) +
            this.getFinalTermMarks(student, classSubject, term)
        );
    }

    getOverallGrade(student: any, classSubject: any, term: any): any {
        let overallMarks = this.getOverallMarks(student, classSubject, term);
        if (overallMarks > 90) {
            return 'A1';
        } else if (overallMarks > 80) {
            return 'A2';
        } else if (overallMarks > 70) {
            return 'B1';
        } else if (overallMarks > 60) {
            return 'B2';
        } else if (overallMarks > 50) {
            return 'C1';
        } else if (overallMarks > 40) {
            return 'C2';
        } else if (overallMarks > 33) {
            return 'D';
        } else {
            return 'E';
        }
    }

    getStudentExtraFieldGrade(student: any, extraField: any, term: any): any {
        let studentExtraField = this.studentExtraFieldList.find((studentExtraField) => {
            return (
                studentExtraField.parentStudent == student.id &&
                studentExtraField.parentExtraField == extraField.id &&
                studentExtraField.parentTerm == term.id
            );
        });
        if (studentExtraField) {
            return studentExtraField.grade;
        } else {
            return '';
        }
    }

    getNextStep(): any {
        let result = '';
        switch (this.selectedClassSection.class.name) {
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

    getPresentDays(student: any, termIndex: any): any {
        return this.termStudentAttendanceList[termIndex].filter((termStudentAttendance) => {
            return termStudentAttendance.parentStudent == student.id && termStudentAttendance.status == this.attendance_status_list[0];
        }).length;
    }

    getWorkingDays(student: any, termIndex: any): any {
        return this.termStudentAttendanceList[termIndex].filter((termStudentAttendance) => {
            return termStudentAttendance.parentStudent == student.id && termStudentAttendance.status != this.attendance_status_list[2];
        }).length;
    }
}
