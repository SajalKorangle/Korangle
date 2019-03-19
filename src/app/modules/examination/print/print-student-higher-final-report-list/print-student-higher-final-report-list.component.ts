import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';
import {TEST_TYPE_LIST} from '../../classes/constants';

@Component({
    selector: 'app-print-student-higher-final-report-list',
    templateUrl: './print-student-higher-final-report-list.component.html',
    styleUrls: ['./print-student-higher-final-report-list.component.css'],
})
export class PrintStudentHigherFinalReportListComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    viewChecked = true;

    subjectList: any;
    studentFinalReportList: any;
    reportCardMapping: any;

    printStudentHigherFinalReportListComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.printStudentHigherFinalReportListComponentSubscription =
            EmitterService.get('print-student-higher-final-report-list-component').subscribe(value => {
                this.subjectList = value['subjectList'];
                this.studentFinalReportList = value['studentFinalReportList'];
                this.reportCardMapping = value['reportCardMapping'];
                this.viewChecked = false;
            });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.subjectList = null;
            this.studentFinalReportList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printStudentHigherFinalReportListComponentSubscription.unsubscribe();
        this.subjectList = null;
        this.studentFinalReportList = null;
    }

    getSubjectName(subjectId: any): any {
        let result = '';
        this.subjectList.every(subject => {
            if (subject.id == subjectId) {
                result = subject.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getQuarterlyMarks(student: any, subjectId: any, maxMarks: any): any {
        let studentMarks = 0;
        let classMaxMarks = 100;
        let tempMaxMarks = student.parentExaminationQuarterlyHigh.classTestList.filter(item => {
            return item.parentSubject == subjectId;
        }).reduce((total, item) => {
            return total + parseFloat(item.maximumMarks);
        }, 0);
        if (tempMaxMarks != 0) {
            classMaxMarks = tempMaxMarks;
        }
        studentMarks = student.parentExaminationQuarterlyHigh.studentTestList.filter(item => {
            return item.parentSubject == subjectId;
        }).reduce((total, item) => {
            return total + parseFloat(item.marksObtained);
        }, 0);
        return ((studentMarks*maxMarks)/classMaxMarks).toFixed(1);
    }

    getHalfYearlyMarks(student: any, subjectId: any, maxMarks: any): any {
        let studentMarks = 0;
        let classMaxMarks = 100;
        let tempMaxMarks = student.parentExaminationHalfYearlyHigh.classTestList.filter(item => {
            return item.parentSubject == subjectId;
        }).reduce((total, item) => {
            return total + parseFloat(item.maximumMarks);
        }, 0);
        if (tempMaxMarks != 0) {
            classMaxMarks = tempMaxMarks;
        }
        studentMarks = student.parentExaminationHalfYearlyHigh.studentTestList.filter(item => {
            return item.parentSubject == subjectId;
        }).reduce((total, item) => {
            return total + parseFloat(item.marksObtained);
        }, 0);
        return ((studentMarks*maxMarks)/classMaxMarks).toFixed(1);
    }

    getFinalMarks(student: any, subjectId: any, maxMarks: any): any {
        if (this.isPractical(student, subjectId)) {
            if (maxMarks == 100) {
                return this.getFinalTheoryMarks(student, subjectId, 75)
                    + this.getFinalPracticalMarks(student, subjectId, 25);
            } else {
                return this.getFinalTheoryMarks(student, subjectId, 60)
                    + this.getFinalPracticalMarks(student, subjectId, 10);
            }
        } else {
            let studentMarks = 0;
            let classMaxMarks = 100;
            let tempMaxMarks = student.parentExaminationFinalHigh.classTestList.filter(item => {
                return item.parentSubject == subjectId;
            }).reduce((total, item) => {
                return total + parseFloat(item.maximumMarks);
            }, 0);
            if (tempMaxMarks != 0) {
                classMaxMarks = tempMaxMarks;
            }
            studentMarks = student.parentExaminationFinalHigh.studentTestList.filter(item => {
                return item.parentSubject == subjectId;
            }).reduce((total, item) => {
                return total + parseFloat(item.marksObtained);
            }, 0);
            return ((studentMarks*maxMarks)/classMaxMarks).toFixed(1);
        }
    }

    getFinalTheoryMarks(student: any, subjectId: any, maxMarks: any): any {
        let studentMarks = 0;
        let classMaxMarks = 75;
        let tempMaxMarks = student.parentExaminationFinalHigh.classTestList.filter(item => {
            return item.parentSubject == subjectId && item.testType == TEST_TYPE_LIST[2];
        }).reduce((total, item) => {
            return total + parseFloat(item.maximumMarks);
        }, 0);
        if (tempMaxMarks != 0) {
            classMaxMarks = tempMaxMarks;
        }
        studentMarks = student.parentExaminationFinalHigh.studentTestList.filter(item => {
            return item.parentSubject == subjectId && item.testType == TEST_TYPE_LIST[2];
        }).reduce((total, item) => {
            return total + parseFloat(item.marksObtained);
        }, 0);
        if (studentMarks == 0) {
            return "";
        }
        return ((studentMarks*maxMarks)/classMaxMarks).toFixed(1);
    }

    getFinalPracticalMarks(student: any, subjectId: any, maxMarks: any): any {
        let studentMarks = 0;
        let classMaxMarks = 25;
        let tempMaxMarks = student.parentExaminationFinalHigh.classTestList.filter(item => {
            return item.parentSubject == subjectId && item.testType == TEST_TYPE_LIST[3];
        }).reduce((total, item) => {
            return total + parseFloat(item.maximumMarks);
        }, 0);
        if (tempMaxMarks != 0) {
            classMaxMarks = tempMaxMarks;
        }
        studentMarks = student.parentExaminationFinalHigh.studentTestList.filter(item => {
            return item.parentSubject == subjectId && item.testType == TEST_TYPE_LIST[3];
        }).reduce((total, item) => {
            return total + parseFloat(item.marksObtained);
        }, 0);
        if (studentMarks == 0) {
            return "";
        }
        return ((studentMarks*maxMarks)/classMaxMarks).toFixed(1);
    }

    isPractical(student: any, subjectId: any): any {
        let result = false;
        student.parentExaminationFinalHigh.classTestList.every(item => {
            if (item.testType == TEST_TYPE_LIST[3]) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    getMonthlyStudentSubjectMarks(student: any, subject: any, subjectIndex: any): any {
    }

    getOverallStudentSubjectMarks(student: any, subject: any, subjectIndex: any): any {
    }

    getOverallStudentSubjectMaxMarks(): any {
    }

    getGrade(marksObtained: any, maximumMarks: any): any {
        let grade = '';
        let percentage = marksObtained*100/maximumMarks;
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
    }

    getOverallStudentTotalSubjectMaxMarks(student: any): any {
    }

    getOverallStudentTotalExtraFieldMarks(student: any, index1: any): any {
    }

    getOverallStudentTotalExtraFieldMaxMarks(index: any): any {
    }

    getOverallStudentAttendance(student: any): any {
        return student.attendanceData.attendance;
    }

    getOverallStudentWorkingDays(student: any): any {
        return student.attendanceData.workingDays;
    }

    getOverallStudentMarks(student: any): any {
        return this.getOverallStudentTotalSubjectMarks(student)
            + this.getOverallStudentTotalExtraFieldMarks(student, 0)
            + this.getOverallStudentTotalExtraFieldMarks(student, 1);
    }

    getOverallStudentMaxMarks(student: any): any {
        return this.getOverallStudentTotalSubjectMaxMarks(student)
            + this.getOverallStudentTotalExtraFieldMaxMarks(0)
            + this.getOverallStudentTotalExtraFieldMaxMarks(1);
    }

    getSessionName(sessionId: any): any {
        let result = '';
        switch(sessionId) {
            case 1:
                result = 'Session 2017-18';
                break;
            case 2:
                result = 'Session 2018-19';
                break;
            case 3:
                result = 'Session 2019-20';
                break;
        }
        return result;
    }

    getNextStep(student: any): any {
        let result = '';
        switch(student.className) {
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

    getThumbImage(row: any): string {
        if (row.profileImage) {
            let url = row.profileImage;
            if (url.substr(url.length-4) === "main") {
                return url + "_thumb";
            }
            return url.substr(0, url.length-4) + "_thumb" + url.substr(url.length-4);
        } else {
            return '';
        }
    }

}
