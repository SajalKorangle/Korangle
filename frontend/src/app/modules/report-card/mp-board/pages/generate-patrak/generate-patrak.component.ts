import { Component, Input, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../../../services/modules/examination/examination.service';

import { GeneratePatrakServiceAdapter } from './generate-patrak.service.adapter';
import { REPORT_CARD_TYPE_LIST } from '../../classes/constants';

import { ChangeDetectorRef } from '@angular/core';
import { ClassService } from '../../../../../services/modules/class/class.service';
import { StudentOldService } from '../../../../../services/modules/student/student-old.service';
import { SubjectOldService } from '../../../../../services/modules/subject/subject-old.service';
import { AttendanceOldService } from '../../../../../services/modules/attendance/attendance-old.service';
import { ExcelService } from '../../../../../excel/excel-service';
import { DataStorage } from '../../../../../classes/data-storage';

@Component({
    selector: 'generate-patrak',
    templateUrl: './generate-patrak.component.html',
    styleUrls: ['./generate-patrak.component.css'],
    providers: [ExaminationOldService, ClassService, StudentOldService, SubjectOldService, AttendanceOldService, ExaminationService],
})
export class GeneratePatrakComponent implements OnInit {
    user;

    reportCardTypeList = REPORT_CARD_TYPE_LIST;

    reportCardMapping: any;
    classStudentList = [];
    selectedClass = null;

    classSubjectList = [];
    subjectList = [];
    extraFieldList = [];
    studentFinalReportCardList = [];

    includeProject: any;

    serviceAdapter: GeneratePatrakServiceAdapter;

    isLoading = true;
    timeout: any;

    constructor(
        public examinationOldService: ExaminationOldService,
        public examinationService: ExaminationService,
        public classService: ClassService,
        public studentService: StudentOldService,
        public subjectService: SubjectOldService,
        public attendanceService: AttendanceOldService,
        private excelService: ExcelService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new GeneratePatrakServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    downloadClassPatrak(): void {
        let template = [];

        template.push(this.getClassHeaderValues());

        template.push(this.getClassPatrakData());

        template.push(this.getStudentHeaderValues());

        this.studentFinalReportCardList.forEach((student, index) => {
            template.push(this.getStudentPatrakData(student, index + 1));
            template.push([
                'Aadhar No.',
                student.aadharNum ? student.aadharNum.toString() : '',
                'SSSMID',
                student.childSSMID,
                'Family Id',
                student.familySSMID,
            ]);
        });

        this.excelService.downloadFile(template, this.selectedClass.name + '_patrak.csv');
    }

    getStudentHeaderValues(): any {
        let studentHeaderValues = [
            'S No.',
            'Roll No.',
            'Scholar No.',
            'Name',
            "Mother's Name",
            "Father's Name",
            'Day',
            'Month',
            'Year',
            'Category',
        ];
        this.classSubjectList.forEach((classSubject) => {
            studentHeaderValues.push(
                this.getSubjectName(classSubject.parentSubject) + ' (' + this.getOverallStudentSubjectMaxMarks() + ')'
            );
        });
        this.extraFieldList.forEach((extraField, index) => {
            studentHeaderValues.push(extraField.name + ' (' + this.getOverallStudentTotalExtraFieldMaxMarks(index) + ')');
        });

        let totalMarksHeader = 'Overall Marks (' + this.getOverallStudentMaxMarks(this.studentFinalReportCardList[0]) + ')';
        studentHeaderValues.push(totalMarksHeader);

        studentHeaderValues.push('Overall Grade');

        let totalAttendanceHeader = 'Total Teaching Days';
        if (this.reportCardMapping.autoAttendance) {
            totalAttendanceHeader += ' (' + this.getOverallStudentWorkingDays(this.studentFinalReportCardList[0]) + ')';
        } else {
            totalAttendanceHeader += '......';
        }
        studentHeaderValues.push(totalAttendanceHeader);
        return studentHeaderValues;
    }

    getStudentPatrakData(student: any, serialNumber: any): any {
        let studentValues = [
            serialNumber,
            student.rollNumber,
            student.scholarNumber,
            student.name,
            student.motherName,
            student.fathersName,
            student.dateOfBirth ? new Date(student.dateOfBirth).getDate() : '',
            student.dateOfBirth ? new Date(student.dateOfBirth).getMonth() + 1 : '',
            student.dateOfBirth ? new Date(student.dateOfBirth).getFullYear() % 100 : '',
            student.category,
        ];
        student.mainSubjectList.forEach((subject, index) => {
            studentValues.push(this.getOverallStudentSubjectMarks(student, subject, index));
        });
        this.extraFieldList.forEach((extraField, index) => {
            studentValues.push(this.getOverallStudentTotalExtraFieldMarks(student, index));
        });
        studentValues.push(this.getOverallStudentMarks(student));
        studentValues.push(this.getGrade(this.getOverallStudentMarks(student), this.getOverallStudentMaxMarks(student)));
        if (this.reportCardMapping.autoAttendance) {
            studentValues.push(this.getOverallStudentAttendance(student));
        } else {
            studentValues.push('');
        }
        return studentValues;
    }

    getClassHeaderValues(): any {
        let classHeaderValues = ['Class Name', 'Total Students', 'A Grade', 'B Grade', 'C Grade', 'D Grade'];
        this.classSubjectList.forEach((classSubject) => {
            classHeaderValues.push('E Grade - ' + this.getSubjectName(classSubject.parentSubject));
        });
        return classHeaderValues;
    }

    getClassPatrakData(): any {
        let classValues = [this.selectedClass.name, this.studentFinalReportCardList.length];
        classValues.push(this.getTotalStudentsInGrade('A'));
        classValues.push(this.getTotalStudentsInGrade('B'));
        classValues.push(this.getTotalStudentsInGrade('C'));
        classValues.push(this.getTotalStudentsInGrade('D'));
        this.classSubjectList.forEach((classSubject, index) => {
            classValues.push(this.getTotalStudentsInEGrade(classSubject, index));
        });
        return classValues;
    }

    getTotalStudentsInGrade(grade: any): any {
        return this.studentFinalReportCardList.filter((student) => {
            if (this.getGrade(this.getOverallStudentMarks(student), this.getOverallStudentMaxMarks(student)) == grade) {
                return true;
            }
            return false;
        }).length;
    }

    getTotalStudentsInEGrade(subject: any, index: any): any {
        return this.studentFinalReportCardList.filter((student) => {
            if (
                this.getGrade(this.getOverallStudentSubjectMarks(student, subject, index), this.getOverallStudentSubjectMaxMarks()) == 'E'
            ) {
                return true;
            }
            return false;
        }).length;
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

    /*printStudentFinalReport(): void {
        let data = {
            'extraFieldList': this.extraFieldList,
            'subjectList': this.subjectList,
            'studentFinalReportList': this.studentFinalReportCardList,
            'reportCardMapping': this.reportCardMapping,
        };
        if (this.reportCardMapping.reportCardType == REPORT_CARD_TYPE_LIST[2]) {
            EmitterService.get('print-student-comprehensive-final-report-list').emit(data);
        } else if (this.reportCardMapping.reportCardType == REPORT_CARD_TYPE_LIST[1]) {
            EmitterService.get('print-student-elegant-final-report-list').emit(data);
        } else {
            EmitterService.get('print-student-classic-final-report-list').emit(data);
        }
        alert('This may take a while');
    }*/
}
