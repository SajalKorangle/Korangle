import { Component, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../../../services/modules/examination/examination.service';

import { GenerateGoshwaraServiceAdapter } from './generate-goshwara.service.adapter';
import { REPORT_CARD_TYPE_LIST } from '../../classes/constants';

import { ChangeDetectorRef } from '@angular/core';
import { ClassService } from '../../../../../services/modules/class/class.service';
import { StudentOldService } from '../../../../../services/modules/student/student-old.service';
import { SubjectOldService } from '../../../../../services/modules/subject/subject-old.service';
import { ExcelService } from '../../../../../excel/excel-service';
import { DataStorage } from '../../../../../classes/data-storage';

@Component({
    selector: 'generate-goshwara',
    templateUrl: './generate-goshwara.component.html',
    styleUrls: ['./generate-goshwara.component.css'],
    providers: [ExaminationOldService, ClassService, StudentOldService, SubjectOldService, ExaminationService],
})
export class GenerateGoshwaraComponent implements OnInit {
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

    serviceAdapter: GenerateGoshwaraServiceAdapter;

    isLoading = true;
    timeout: any;

    constructor(
        public examinationOldService: ExaminationOldService,
        public examinationService: ExaminationService,
        public classService: ClassService,
        public studentService: StudentOldService,
        public subjectService: SubjectOldService,
        private excelService: ExcelService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new GenerateGoshwaraServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    getStudentsInGrade(studentList: any, grade: any): any {
        return studentList.filter((student) => {
            if (this.getGrade(this.getOverallStudentMarks(student), this.getOverallStudentMaxMarks(student)) == grade) {
                return true;
            }
            return false;
        }).length;
    }

    getStudentsInEGrade(studentList: any, subject: any, index: any): any {
        return studentList.filter((student) => {
            if (
                this.getGrade(this.getOverallStudentSubjectMarks(student, subject, index), this.getOverallStudentSubjectMaxMarks()) == 'E'
            ) {
                return true;
            }
            return false;
        }).length;
    }

    downloadGoshwara(): void {
        let template = [];

        template.push(this.getHeaderValues());

        template.push(this.getMaleStudentsGoshwara());

        template.push(this.getFemaleStudentsGoshwara());

        template.push(this.getTotalStudentsGoshwara());

        template.push(this.getScStudentsGoshwara());

        template.push(this.getStStudentsGoshwara());

        this.excelService.downloadFile(template, this.selectedClass.name + '_goshwara.csv');
    }

    getHeaderValues(): any {
        let headerValues = ['Description', 'Total', 'A Grade', 'B Grade', 'C Grade', 'D Grade'];
        this.classSubjectList.forEach((classSubject) => {
            headerValues.push('E Grade - ' + this.getSubjectName(classSubject.parentSubject));
        });
        return headerValues;
    }

    getMaleStudentsGoshwara(): any {
        let studentList = this.studentFinalReportCardList.filter((student) => {
            return student.gender == 'Male';
        });
        let classValues = ['Male', studentList.length];
        classValues.push(this.getStudentsInGrade(studentList, 'A'));
        classValues.push(this.getStudentsInGrade(studentList, 'B'));
        classValues.push(this.getStudentsInGrade(studentList, 'C'));
        classValues.push(this.getStudentsInGrade(studentList, 'D'));
        this.classSubjectList.forEach((classSubject, index) => {
            classValues.push(this.getStudentsInEGrade(studentList, classSubject, index));
        });
        return classValues;
    }

    getFemaleStudentsGoshwara(): any {
        let studentList = this.studentFinalReportCardList.filter((student) => {
            return student.gender == 'Female';
        });
        let classValues = ['Female', studentList.length];
        classValues.push(this.getStudentsInGrade(studentList, 'A'));
        classValues.push(this.getStudentsInGrade(studentList, 'B'));
        classValues.push(this.getStudentsInGrade(studentList, 'C'));
        classValues.push(this.getStudentsInGrade(studentList, 'D'));
        this.classSubjectList.forEach((classSubject, index) => {
            classValues.push(this.getStudentsInEGrade(studentList, classSubject, index));
        });
        return classValues;
    }

    getTotalStudentsGoshwara(): any {
        let studentList = this.studentFinalReportCardList;
        let classValues = ['Total', studentList.length];
        classValues.push(this.getStudentsInGrade(studentList, 'A'));
        classValues.push(this.getStudentsInGrade(studentList, 'B'));
        classValues.push(this.getStudentsInGrade(studentList, 'C'));
        classValues.push(this.getStudentsInGrade(studentList, 'D'));
        this.classSubjectList.forEach((classSubject, index) => {
            classValues.push(this.getStudentsInEGrade(studentList, classSubject, index));
        });
        return classValues;
    }

    getScStudentsGoshwara(): any {
        let studentList = this.studentFinalReportCardList.filter((student) => {
            return student.category == 'SC';
        });
        let classValues = ['SC', studentList.length];
        classValues.push(this.getStudentsInGrade(studentList, 'A'));
        classValues.push(this.getStudentsInGrade(studentList, 'B'));
        classValues.push(this.getStudentsInGrade(studentList, 'C'));
        classValues.push(this.getStudentsInGrade(studentList, 'D'));
        this.classSubjectList.forEach((classSubject, index) => {
            classValues.push(this.getStudentsInEGrade(studentList, classSubject, index));
        });
        return classValues;
    }

    getStStudentsGoshwara(): any {
        let studentList = this.studentFinalReportCardList.filter((student) => {
            return student.gender == 'ST';
        });
        let classValues = ['ST', studentList.length];
        classValues.push(this.getStudentsInGrade(studentList, 'A'));
        classValues.push(this.getStudentsInGrade(studentList, 'B'));
        classValues.push(this.getStudentsInGrade(studentList, 'C'));
        classValues.push(this.getStudentsInGrade(studentList, 'D'));
        this.classSubjectList.forEach((classSubject, index) => {
            classValues.push(this.getStudentsInEGrade(studentList, classSubject, index));
        });
        return classValues;
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
}
