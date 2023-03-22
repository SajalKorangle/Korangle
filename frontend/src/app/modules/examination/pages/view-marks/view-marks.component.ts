import { Component, OnInit } from '@angular/core';

import { ViewMarksServiceAdapter } from './view-marks.service.adapter';
import { TEST_TYPE_LIST } from '../../../../classes/constants/test-type';
import { isMobile } from '../../../../classes/common.js';

import { ChangeDetectorRef } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { EmployeeService } from '../../../../services/modules/employee/employee.service';
import xlsx = require('xlsx');
import { ViewMarksHtmlRenderer } from './view-marks.html.renderer';

@Component({
    selector: 'view-class-marks',
    templateUrl: './view-marks.component.html',
    styleUrls: ['./view-marks.component.css'],
    providers: [ExaminationService, StudentService, ClassService, SubjectService, EmployeeService],
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
    showSubjectTestList: any;
    studentList: any;
    studentTestList: any;
    classSubjectList: any;

    testTypeList = TEST_TYPE_LIST;

    serviceAdapter: ViewMarksServiceAdapter;
    htmlRenderer: ViewMarksHtmlRenderer;

    isInitialLoading = false;

    isLoading = false;
    subjectFilterDisplay = false;
    sortBy = 'rollNumber';
    AbsentRep = 'A';
    sortingOrder = 1; //1: ascending, -1: descending

    constructor(
        public examinationService: ExaminationService,
        public classService: ClassService,
        public subjectService: SubjectService,
        public studentService: StudentService,
        public employeeService: EmployeeService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new ViewMarksHtmlRenderer();
        this.htmlRenderer.initialize(this);
        this.serviceAdapter = new ViewMarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    updateSortingParameters(sortparam) {
        if (this.sortBy === sortparam) {
            this.sortingOrder = this.sortingOrder === 1 ? -1 : 1;
        } else this.sortingOrder = 1;
        this.sortBy = sortparam;
    }

    showSubjectTestListSwitch(index) {
        this.showSubjectTestList[index] = !this.showSubjectTestList[index];
    }

    getFilteredTestList(): any {
        return this.testList.filter((element, index) => this.showSubjectTestList[index]);
    }

    showSectionName(classSection: any): boolean {
        return (
            this.classSectionList.filter((item) => {
                return item.class.id == classSection.class.id;
            }).length > 1
        );
    }

    SortingComparatorFunction = (a, b) => {
        let ret;
        switch (this.sortBy) {
            case 'rollNumber':
            case 'rank':
                ret = a[this.sortBy] - b[this.sortBy];
                break;
            case 'name':
                console.log('name');
                ret = this.getStudent(a).name.localeCompare(this.getStudent(b).name);
                break;
            default:
                ret = this.getStudentMarks(a, this.sortBy) - this.getStudentMarks(b, this.sortBy);
        }
        return ret * this.sortingOrder;
    }

    getSortedFilteredStudentSectionList(): any {
        let list = this.getFilteredStudentSectionList(); //filtered student result
        list.sort((a, b) => {
            // sort according to rank (maximun marks)
            return this.getStudentFilteredTotalMarks(b) - this.getStudentFilteredTotalMarks(a);
        });
        list = list.map((element, index) => {
            // add rank key studentSelection object
            element.rank = index + 1;
            return element;
        });
        list.sort(this.SortingComparatorFunction); // sort according to roll number
        return list;
    }

    getFilteredStudentSectionList(): any {
        return this.studentSectionList.filter((item) => {
            return item.parentClass == this.selectedClassSection.class.id && item.parentDivision == this.selectedClassSection.section.id;
        });
    }

    getSubject(test: any): any {
        return this.subjectList.find((subject) => {
            return subject.id == test.parentSubject;
        });
    }

    getStudent(studentSection: any): any {
        return this.studentList.find((student) => {
            return student.id == studentSection.parentStudent;
        });
    }

    getFilteredTotalMaximumMarks() {
        return this.getFilteredTestList().reduce((total, test) => {
            return total + test.maximumMarks;
        }, 0);
    }

    getStudentMarks(studentSection: any, test: any): any {
        let studentTest = this.studentTestList.find((item) => {
            return (
                studentSection.parentStudent == item.parentStudent &&
                test.parentSubject == item.parentSubject &&
                test.testType == item.testType
            );
        });
        if (studentTest) {
            return studentTest.marksObtained;
        } 
        else {
            return 0;
        }
    }

    getStudentAbsentStatus(studentSection: any, test: any): any {
        let studentTest = this.studentTestList.find((item) => {
            return (
                studentSection.parentStudent == item.parentStudent &&
                test.parentSubject == item.parentSubject &&
                test.testType == item.testType
            );
        });
        if (studentTest) {
            return studentTest.absent;
        } else {
            return false;
        }
    }

    getStudentFilteredTotalMarks(studentSection: any): any {
        return this.getFilteredTestList().reduce((total, test) => {
            return total + parseFloat(this.getStudentMarks(studentSection, test));
        }, 0);
    }

    getEmployee(test: any): any {
        return this.employeeList.find((employee) => {
            return (
                employee.id ==
                this.classSubjectList.find((classSubject) => {
                    return classSubject.parentSubject == test.parentSubject;
                }).parentEmployee
            );
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
        let maximumMarks = this.getFilteredTotalMaximumMarks();

        let headers = ['Rank', 'Student', 'Roll No.', `Total(${maximumMarks})`];

        this.getFilteredTestList().forEach((test) => {
            let subjectName = this.getSubject(test).name;
            if (test.testType) {
                subjectName += ' - ' + test.testType;
            }
            subjectName += ' (' + test.maximumMarks + ')';
            headers.push(subjectName);
        });

        template = [headers];

        let count = 0;
        this.getSortedFilteredStudentSectionList().forEach((studentSection) => {
            let row = [];
            row.push(studentSection.rank);
            row.push(this.getStudent(studentSection).name);
            row.push(studentSection.rollNumber);
            let marks = this.getStudentFilteredTotalMarks(studentSection);
            row.push(marks.toString() + ` (${((marks * 100) / maximumMarks).toFixed(2).toString()})%`);
            this.getFilteredTestList().forEach((test) => {
                if(this.getStudentAbsentStatus(studentSection, test)) {
                    row.push(this.AbsentRep);
                } else {
                    row.push(this.getStudentMarks(studentSection, test));
                }
            });
            template.push(row);
        });

        let fileName = 'korangle_' + this.selectedClassSection.class.name;
        if (this.showSectionName(this.selectedClassSection)) {
            fileName += '_' + this.selectedClassSection.section.name;
        }
        fileName += '_' + this.selectedExamination.name + '.xlsx';

        let ws = xlsx.utils.aoa_to_sheet(template);
        let wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        xlsx.writeFile(wb, fileName);
    }
}
