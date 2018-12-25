import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';
import {TEST_TYPE_LIST} from '../../classes/constants';

@Component({
    selector: 'app-print-student-marksheet-list',
    templateUrl: './print-student-marksheet-list.component.html',
    styleUrls: ['./print-student-marksheet-list.component.css'],
})
export class PrintStudentMarksheetListComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    viewChecked = true;

    examination: any;

    printStudentMarksheetListComponentSubscription: any;

    constructor(private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.printStudentMarksheetListComponentSubscription =
            EmitterService.get('print-student-marksheet-list-component').subscribe(value => {
                this.examination = value;
                this.viewChecked = false;
            });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.examination = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printStudentMarksheetListComponentSubscription.unsubscribe();
        this.examination = null;
    }

    getFilteredStudentList(studentList: any): any {
        return studentList.filter(student => {
            if (student.parentTransferCertificate === null) {
                return true;
            }
            return false;
        })
    }

    isOralIncluded(student: any): boolean {
        let result = false;
        student.subjectList.every(item => {
            item.testDetails.every(itemTwo => {
                if (itemTwo.testType === TEST_TYPE_LIST[0]) {
                    result = true;
                    return false;
                }
                return true;
            });
            if (result) {
                return false;
            }
            return true;
        });
        return result;
    }

    isPracticalIncluded(student: any): boolean {
        let result = false;
        student.subjectList.every(item => {
            item.testDetails.every(itemTwo => {
                if (itemTwo.testType === TEST_TYPE_LIST[3]) {
                    result = true;
                    return false;
                }
                return true;
            });
            if (result) {
                return false;
            }
            return true;
        });
        return result;
    }

    isMainSubject(subject: any): boolean {
        let result = false;
        this.examination.selectedClass.selectedSection.subjectList.every(item => {
            if (item.id === subject.id && item.mainSubject === true) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    isOnlyGrade(subject: any): boolean {
        let result = false;
        this.examination.selectedClass.selectedSection.subjectList.every(item => {
            if (item.id === subject.id && item.onlyGrade === true) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    getMainSubjectList(subjectList: any): any {
        return subjectList.filter(item => {
            if (item.mainSubject === true) {
                return true;
            }
            return false;
        });
    }

    getNonMainSubjectList(subjectList: any): any {
        return subjectList.filter(item => {
            if (item.mainSubject === false) {
                return true;
            }
            return false;
        });
    }

    isMultipleTest(student: any): boolean {
        let result = false;

        student.subjectList.every(item => {
            if (item.testDetails.length > 1) {
                result = true;
                return false;
            }
            return true;
        });

        return result;
    }

    getSubjectOralMaxMarks(subject: any): any {
        let result = 0;
        this.examination.selectedClass.selectedSection.subjectList.every(item => {
            if (item.id === subject.id) {
                item.testDetails.every(itemTwo => {
                    if (itemTwo.testType === TEST_TYPE_LIST[0]) {
                        result = parseInt(itemTwo.maximumMarks);
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
        if (result === 0) {
            return '';
        } else {
            return result;
        }
    }

    getSubjectWrittenMaxMarks(subject: any): any {
        let result = 0;
        this.examination.selectedClass.selectedSection.subjectList.every(item => {
            if (item.id === subject.id) {
                item.testDetails.every(itemTwo => {
                    if (itemTwo.testType === TEST_TYPE_LIST[1]) {
                        result = parseInt(itemTwo.maximumMarks);
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
        if (result === 0) {
            return '';
        } else {
            return result;
        }
    }

    getSubjectTheoryMaxMarks(subject: any): any {
        let result = 0;
        this.examination.selectedClass.selectedSection.subjectList.every(item => {
            if (item.id === subject.id) {
                item.testDetails.every(itemTwo => {
                    if (itemTwo.testType === TEST_TYPE_LIST[2]) {
                        result = parseInt(itemTwo.maximumMarks);
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
        if (result === 0) {
            return '';
        } else {
            return result;
        }
    }

    getSubjectPracticalMaxMarks(subject: any): any {
        let result = 0;
        this.examination.selectedClass.selectedSection.subjectList.every(item => {
            if (item.id === subject.id) {
                item.testDetails.every(itemTwo => {
                    if (itemTwo.testType === TEST_TYPE_LIST[3]) {
                        result = parseInt(itemTwo.maximumMarks);
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
        if (result === 0) {
            return '';
        } else {
            return result;
        }
    }

    getSubjectTotalMaxMarks(subject: any): any {
        let result = 0;
        this.examination.selectedClass.selectedSection.subjectList.every(item => {
            if (item.id === subject.id) {
                item.testDetails.forEach(itemTwo => {
                    result += parseInt(itemTwo.maximumMarks);
                });
                return false;
            }
            return true;
        });
        return result;
    }

    getSubjectOralMarksObtained(subject: any): any {
        let result = 0;
        subject.testDetails.every(item => {
            if (item.testType === TEST_TYPE_LIST[0]) {
                result = parseFloat(item.marksObtained);
                return false;
            }
            return true;
        });
        if (result === 0) {
            return '';
        } else {
            return result;
        }
    }

    getSubjectWrittenMarksObtained(subject: any): any {
        let result = 0;
        subject.testDetails.every(item => {
            if (item.testType === TEST_TYPE_LIST[1]) {
                result = parseFloat(item.marksObtained);
                return false;
            }
            return true;
        });
        if (result === 0) {
            return '';
        } else {
            return result;
        }
    }

    getSubjectTheoryMarksObtained(subject: any): any {
        let result = 0;
        subject.testDetails.every(item => {
            if (item.testType === TEST_TYPE_LIST[2]) {
                result = parseFloat(item.marksObtained);
                return false;
            }
            return true;
        });
        if (result === 0) {
            return '';
        } else {
            return result;
        }
    }

    getSubjectPracticalMarksObtained(subject: any): any {
        let result = 0;
        subject.testDetails.every(item => {
            if (item.testType === TEST_TYPE_LIST[3]) {
                result = parseFloat(item.marksObtained);
                return false;
            }
            return true;
        });
        if (result === 0) {
            return '';
        } else {
            return result;
        }
    }

    getSubjectTotalMarksObtained(subject: any): any {
        let result = 0;
        subject.testDetails.forEach(item => {
            result += parseFloat(item.marksObtained);
        });
        return result;
    }

    getTotalMaximumMarks(student: any): any {
        let result = 0;
        student.subjectList.forEach(item => {
            if(this.isMainSubject(item)) {
                result += parseInt(this.getSubjectTotalMaxMarks(item));
            }
        });
        return result;
    }

    getTotalMarksObtained(student: any, parseToInt=false): any {
        let result = 0;
        student.subjectList.forEach(item => {
            if(this.isMainSubject(item)) {
                result += parseFloat(this.getSubjectTotalMarksObtained(item));
            }
        });
        if (parseToInt) {
            return Math.floor(result);
        } else {
            return result;
        }
    }

    getSubjectGrade(subject: any): any {

        let marksObtained = this.getSubjectTotalMarksObtained(subject);
        let maximumMarks = this.getSubjectTotalMaxMarks(subject);

        let percentage = marksObtained/maximumMarks*100;

        return this.getGradeFromPercentage(percentage);
    }

    getOverallGrade(student: any): any {

        let percentage = this.getPercentage(student);

        return this.getGradeFromPercentage(percentage);
    }

    getGradeFromPercentage(percentage: any): any {
        if (percentage >=75) {
            return 'A';
        } else if (percentage >= 60) {
            return 'B';
        } else if (percentage >= 45) {
            return 'C';
        } else if (percentage >= 33) {
            return 'D';
        } else {
            return 'E';
        }
    }

    getPercentage(student: any) {
        return this.getTotalMarksObtained(student)/this.getTotalMaximumMarks(student)*100;
    }

}
