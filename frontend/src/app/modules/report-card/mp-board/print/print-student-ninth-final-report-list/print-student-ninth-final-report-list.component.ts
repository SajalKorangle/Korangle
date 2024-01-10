import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { TEST_TYPE_LIST } from '../../../../../classes/constants/test-type';
import { PrintService } from '../../../../../print/print-service';

@Component({
    templateUrl: './print-student-ninth-final-report-list.component.html',
    styleUrls: ['./print-student-ninth-final-report-list.component.css'],
})
export class PrintStudentNinthFinalReportListComponent implements OnInit, OnDestroy, AfterViewChecked {
    user: any;

    viewChecked = true;

    subjectList: any;
    studentFinalReportList: any;
    reportCardMapping: any;
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
        this.studentFinalReportList = value['studentFinalReportList'];
        this.reportCardMapping = value['reportCardMapping'];
        this.showPrincipalSignature = value['showPrincipalSignature'];
        this.classTeacherSignature = value['classTeacherSignature'];
        this.boardList = value['boardList'];
        this.sessionList = value['sessionList'];
        this.marksDecimalPoint =
            '1.' + this.reportCardMapping.minimumDecimalPoints.toString() + '-' + this.reportCardMapping.maximumDecimalPoints;
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.subjectList = null;
            this.studentFinalReportList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.subjectList = null;
        this.studentFinalReportList = null;
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

    getQuarterlyMarks(student: any, subjectId: any, maxMarks: any): number {
        let studentMarks = 0;
        let classMaxMarks = 100;
        let tempMaxMarks = student.parentExaminationQuarterlyHigh.classTestList
            .filter((item) => {
                return item.parentSubject == subjectId;
            })
            .reduce((total, item) => {
                return total + parseFloat(item.maximumMarks);
            }, 0);
        if (tempMaxMarks != 0) {
            classMaxMarks = tempMaxMarks;
        }
        studentMarks = student.parentExaminationQuarterlyHigh.studentTestList
            .filter((item) => {
                return item.parentSubject == subjectId;
            })
            .reduce((total, item) => {
                return total + parseFloat(item.marksObtained);
            }, 0);
        return parseFloat(((studentMarks * maxMarks) / classMaxMarks).toFixed(this.reportCardMapping.maximumDecimalPoints));
    }

    getHalfYearlyMarks(student: any, subjectId: any, maxMarks: any): number {
        let studentMarks = 0;
        let classMaxMarks = 100;
        let tempMaxMarks = student.parentExaminationHalfYearlyHigh.classTestList
            .filter((item) => {
                return item.parentSubject == subjectId;
            })
            .reduce((total, item) => {
                return total + parseFloat(item.maximumMarks);
            }, 0);
        if (tempMaxMarks != 0) {
            classMaxMarks = tempMaxMarks;
        }
        studentMarks = student.parentExaminationHalfYearlyHigh.studentTestList
            .filter((item) => {
                return item.parentSubject == subjectId;
            })
            .reduce((total, item) => {
                return total + parseFloat(item.marksObtained);
            }, 0);
        return parseFloat(((studentMarks * maxMarks) / classMaxMarks).toFixed(this.reportCardMapping.maximumDecimalPoints));
    }

    getFinalMarks(student: any, subjectId: any, maxMarks: any): number {
        if (this.isPractical(student, subjectId)) {
            if (maxMarks == 100) {
                return this.getFinalTheoryMarks(student, subjectId, 75) + this.getFinalPracticalMarks(student, subjectId, 25);
            } else {
                return this.getFinalTheoryMarks(student, subjectId, 60) + this.getFinalPracticalMarks(student, subjectId, 10);
            }
        } else {
            let studentMarks = 0;
            let classMaxMarks = 100;
            let tempMaxMarks = student.parentExaminationFinalHigh.classTestList
                .filter((item) => {
                    return item.parentSubject == subjectId;
                })
                .reduce((total, item) => {
                    return total + parseFloat(item.maximumMarks);
                }, 0);
            if (tempMaxMarks != 0) {
                classMaxMarks = tempMaxMarks;
            }
            studentMarks = student.parentExaminationFinalHigh.studentTestList
                .filter((item) => {
                    return item.parentSubject == subjectId;
                })
                .reduce((total, item) => {
                    return total + parseFloat(item.marksObtained);
                }, 0);
            return parseFloat(((studentMarks * maxMarks) / classMaxMarks).toFixed(this.reportCardMapping.maximumDecimalPoints));
        }
    }

    getFinalTheoryMarks(student: any, subjectId: any, maxMarks: any): number {
        let studentMarks = 0;
        let classMaxMarks = 75;
        let tempMaxMarks = student.parentExaminationFinalHigh.classTestList
            .filter((item) => {
                return item.parentSubject == subjectId && item.testType == TEST_TYPE_LIST[2];
            })
            .reduce((total, item) => {
                return total + parseFloat(item.maximumMarks);
            }, 0);
        if (tempMaxMarks != 0) {
            classMaxMarks = tempMaxMarks;
        }
        studentMarks = student.parentExaminationFinalHigh.studentTestList
            .filter((item) => {
                return item.parentSubject == subjectId && item.testType == TEST_TYPE_LIST[2];
            })
            .reduce((total, item) => {
                return total + parseFloat(item.marksObtained);
            }, 0);
        return parseFloat(((studentMarks * maxMarks) / classMaxMarks).toFixed(this.reportCardMapping.maximumDecimalPoints));
    }

    getFinalPracticalMarks(student: any, subjectId: any, maxMarks: any): number {
        let studentMarks = 0;
        let classMaxMarks = 25;
        let tempMaxMarks = student.parentExaminationFinalHigh.classTestList
            .filter((item) => {
                return item.parentSubject == subjectId && item.testType == TEST_TYPE_LIST[3];
            })
            .reduce((total, item) => {
                return total + parseFloat(item.maximumMarks);
            }, 0);
        if (tempMaxMarks != 0) {
            classMaxMarks = tempMaxMarks;
        }
        studentMarks = student.parentExaminationFinalHigh.studentTestList
            .filter((item) => {
                return item.parentSubject == subjectId && item.testType == TEST_TYPE_LIST[3];
            })
            .reduce((total, item) => {
                return total + parseFloat(item.marksObtained);
            }, 0);
        return parseFloat(((studentMarks * maxMarks) / classMaxMarks).toFixed(this.reportCardMapping.maximumDecimalPoints));
    }

    getTotalSubjectMarks(student: any, subjectId: any): number {
        return (
            this.getQuarterlyMarks(student, subjectId, 5) +
            this.getHalfYearlyMarks(student, subjectId, 5) +
            this.getFinalMarks(student, subjectId, 70)
        );
    }

    getTotalBestFiveMarks(student: any): number {
        let marks_list = [];
        student.subjectList.forEach((subject) => {
            marks_list.push(this.getTotalSubjectMarks(student, subject.parentSubject));
        });
        if (marks_list.length > 5) {
            marks_list = marks_list
                .sort((a, b) => {
                    return b - a;
                })
                .slice(0, 5);
        }
        return marks_list.reduce((total, item) => {
            return total + item;
        }, 0);
    }

    isPractical(student: any, subjectId: any): boolean {
        let result = false;
        student.parentExaminationFinalHigh.classTestList.every((item) => {
            if (item.testType == TEST_TYPE_LIST[3] && item.parentSubject == subjectId) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    getSubjectResult(student: any, subjectId: any): any {
        if (this.getTotalSubjectMarks(student, subjectId) >= 26.4) {
            return 'PASS';
        }
        if (this.getTotalSubjectMarks(student, subjectId) < 26.4) {
            if (this.getOverallResult(student) == 'FAIL') {
                return 'FAIL';
            }
            return 'SUPPL.';
        }
    }

    getOverallResult(student: any): any {
        let marks_list = [];
        student.subjectList.forEach((subject) => {
            let tempItem = {
                subject: subject,
                marks: this.getTotalSubjectMarks(student, subject.parentSubject),
            };
            marks_list.push(tempItem);
        });
        let failNumber = 0;
        let supplSubject = [];
        marks_list.forEach((item) => {
            if (item.marks < 26.4) {
                failNumber += 1;
                supplSubject.push(this.getSubjectName(item.subject.parentSubject));
            }
        });
        if (failNumber > marks_list.length - 4) {
            return 'FAIL';
        } else if (failNumber == 0) {
            return 'PASS';
        } else {
            return 'SUPPL. in ' + supplSubject.join();
        }
    }

    getOverallStudentAttendance(student: any): any {
        return student.attendanceData.attendance;
    }

    getOverallStudentWorkingDays(student: any): any {
        return student.attendanceData.workingDays;
    }

    getPercentage(student: any): any {
        let marksObtained = this.getTotalBestFiveMarks(student) + student.cceMarks;
        return marksObtained / 5;
    }

    getSessionName(sessionId: any): any {
        return this.sessionList.find(session => {
            return session.id == sessionId;
        }).name;
    }

    /*getNextStep(student: any): any {
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
    }*/

    getDivision(student: any): any {
        let result = this.getOverallResult(student);
        if (result == 'FAIL' || result.match('SUPPL.') != '') {
            return result;
        }
        let percentage = this.getPercentage(student);
        if (percentage >= 60) {
            return 'Pass with First Division';
        } else if (percentage >= 45) {
            return 'Pass with Second Division';
        } else if (percentage >= 33) {
            return 'Pass with Third Division';
        }
        return '';
    }
}
