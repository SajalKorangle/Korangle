import { Component, Input, OnInit } from '@angular/core';

import { SubjectOldService } from '../../../../services/modules/subject/subject-old.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import { SchoolService } from '../../../../services/modules/school/school.service';

import { SetClassSubjectServiceAdapter } from './set-class-subject.service.adapter';
import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { GenericService } from '@services/generic/generic-service';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'set-class-subject',
    templateUrl: './set-class-subject.component.html',
    styleUrls: ['./set-class-subject.component.css'],
    providers: [
        SubjectOldService,
        ClassService,
        StudentOldService,
        SchoolService,
        EmployeeOldService,
        GenericService,
    ],
})
export class SetClassSubjectComponent implements OnInit {
    user;

    serviceAdapter: SetClassSubjectServiceAdapter;

    isSessionLoading = false;
    isLoading = false;

    selectedSession: any;
    selectedSubject = null;
    selectedEmployee = null;
    orderNumber = 0;
    mainSubject = true;
    onlyGrade = false;

    selectedClass: any;
    classSectionSubjectList: any;

    subjectList: any;
    filteredSubjectList: any;
    sessionList: any;

    employeeList: any;

    constructor(
        public subjectService: SubjectOldService,
        public classService: ClassService,
        public studentService: StudentOldService,
        public schoolService: SchoolService,
        public employeeService: EmployeeOldService,
        public genericService: GenericService,
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SetClassSubjectServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    getFilteredSubjectList(): void {
        this.filteredSubjectList = [];
        this.subjectList.forEach((subject) => {
            let shouldBeAdded = true;
            this.selectedClass.selectedSection.subjectList.every((subjectTwo) => {
                if (subjectTwo.parentSubject === subject.id) {
                    shouldBeAdded = false;
                    return false;
                }
                return true;
            });
            if (shouldBeAdded) {
                this.filteredSubjectList.push(subject);
            }
        });
        return this.filteredSubjectList;
    }

    getSubjectName(subject: any): any {
        let result = '';
        this.subjectList.every((subj) => {
            if (subj.id === subject.parentSubject) {
                result = subj.name;
                return false;
            }
            return true;
        });
        return result;
    }

    isSubjectUpdateDisabled(subject: any): boolean {
        if (
            subject.newEmployee.id !== subject.parentEmployee ||
            subject.newMainSubject !== subject.mainSubject ||
            subject.newOrderNumber !== subject.orderNumber ||
            subject.newOnlyGrade !== subject.onlyGrade
        ) {
            return false;
        }
        return true;
    }
}
