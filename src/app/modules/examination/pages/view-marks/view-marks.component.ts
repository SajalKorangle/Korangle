import { Component, OnInit } from '@angular/core';

import { ViewMarksServiceAdapter } from './view-marks.service.adapter';
import {TEST_TYPE_LIST} from '../../../../classes/constants/test-type';
import { isMobile } from '../../../../classes/common.js';

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import {SubjectService} from "../../../../services/modules/subject/subject.service";
import {ClassService} from "../../../../services/modules/class/class.service";
import {StudentService} from "../../../../services/modules/student/student.service";
import {ExaminationService} from "../../../../services/modules/examination/examination.service";
import {EmployeeService} from "../../../../services/modules/employee/employee.service";
import {ExcelService} from "../../../../excel/excel-service";

@Component({
    selector: 'view-class-marks',
    templateUrl: './view-marks.component.html',
    styleUrls: ['./view-marks.component.css'],
    providers: [ ExaminationService, StudentService, ClassService, SubjectService, EmployeeService, ExcelService ],
})

export class ViewMarksComponent implements OnInit {

   user;

    showTestDetails = false;

    selectedExamination: any;
    selectedClassSection: any;

    employeeList: any;
    subjectList: any;

    examinationList: any;
    classSectionList: any;
    studentSectionList: any;

    testList: any;
    studentList: any;
    studentTestList: any;
    classSubjectList: any;

    testTypeList = TEST_TYPE_LIST;

    serviceAdapter: ViewMarksServiceAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(public examinationService: ExaminationService,
                public classOldService: ClassService,
                public subjectService: SubjectService,
                public studentService: StudentService,
                public employeeService: EmployeeService,
                public excelService: ExcelService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewMarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    showSectionName(classSection: any): boolean {
        return this.classSectionList.filter(item => {
            return item.class.id == classSection.class.id;
        }).length > 1;
    }

    getSortedFilteredStudentSectionList(): any {
        return this.getFilteredStudentSectionList().sort((a,b) => {
            return this.getStudentTotalMarks(b) - this.getStudentTotalMarks(a);
        });
    }

    getFilteredStudentSectionList(): any {
        return this.studentSectionList.filter(item => {
            return item.parentClass == this.selectedClassSection.class.id
                && item.parentDivision == this.selectedClassSection.section.id;
        });
    }

    getSubject(test: any): any {
        return this.subjectList.find(subject => {
            return subject.id == test.parentSubject;
        });
    }

    getStudent(studentSection: any): any {
        return this.studentList.find(student => {
            return student.id == studentSection.parentStudent;
        });
    }

    getStudentMarks(studentSection: any, test: any): any {

        let studentTest = this.studentTestList.find(item => {
            return studentSection.parentStudent == item.parentStudent
                && test.parentSubject == item.parentSubject
                && test.testType == item.testType;
        });
        if (studentTest) {
            return studentTest.marksObtained;
        } else {
            return 0;
        }

    }

    getStudentTotalMarks(studentSection: any): any {
        return this.testList.reduce((total, test) => {
            return total + parseFloat(this.getStudentMarks(studentSection, test));
        }, 0);
    }

    getEmployee(test: any): any {
        return this.employeeList.find(employee => {
            return employee.id == this.classSubjectList.find(classSubject => {
                return classSubject.parentSubject == test.parentSubject;
            }).parentEmployee;
        });
    }

    getEmployeeName(test: any): any {
        let employee = this.getEmployee(test);
        if (employee) {
            return employee.name;
        } else {
            return '';
        }
    }

    getEmployeeMobileNumber(test: any): any {
        let employee = this.getEmployee(test);
        if (employee) {
            return employee.mobileNumber;
        } else {
            return '';
        }
    }

    isMobile(): boolean {
        return isMobile();
    }

    downloadList(): void {

        let template: any;

        let headers = ['Rank', 'Student', 'Roll No.' ];

        this.testList.forEach(test => {
            let subjectName = this.getSubject(test).name;
            if (test.testType) {
                subjectName += ' - '+test.testType;
            }
            subjectName += ' ('+test.maximumMarks+')';
            headers.push(subjectName);
        });

        template = [

            headers,

        ];

        let count = 0;
        this.getSortedFilteredStudentSectionList().forEach(studentSection => {
            let row = [];
            row.push(++count);
            row.push(this.getStudent(studentSection).name);
            row.push(studentSection.rollNumber);
            this.testList.forEach(test => {
                row.push(this.getStudentMarks(studentSection, test));
            });
            template.push(row);
        });

        let fileName = 'korangle_'+this.selectedClassSection.class.name;
        if (this.showSectionName(this.selectedClassSection)) {
            fileName += '_'+this.selectedClassSection.section.name;
        }
        fileName += '_'+this.selectedExamination.name+'.csv';

        this.excelService.downloadFile(template, fileName);
    }

}
