import { Component, Input, OnInit } from '@angular/core';

import { SubjectService } from '../../../../services/subject.service';
import { ClassService } from '../../../../services/class.service';
import { StudentOldService } from '../../../students/student-old.service';
import { SchoolService } from '../../../../services/school.service';


import { SetClassSubjectServiceAdapter } from './set-class-subject.service.adapter';
import {EmployeeService} from '../../../employee/employee.service';

@Component({
    selector: 'set-class-subject',
    templateUrl: './set-class-subject.component.html',
    styleUrls: ['./set-class-subject.component.css'],
    providers: [ SubjectService, ClassService, StudentOldService, SchoolService, EmployeeService ],
})

export class SetClassSubjectComponent implements OnInit {

    @Input() user;

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

    constructor(public subjectService: SubjectService,
                public classService: ClassService,
                public studentService: StudentOldService,
                public schoolService: SchoolService,
                public employeeService: EmployeeService) {}

    ngOnInit(): void {
        this.serviceAdapter = new SetClassSubjectServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    getFilteredSubjectList(): void {
        this.filteredSubjectList = [];
        this.subjectList.forEach(subject => {
            let shouldBeAdded = true;
            this.selectedClass.selectedSection.subjectList.every(subjectTwo => {
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
        this.subjectList.every(subj => {
            if (subj.id === subject.parentSubject) {
                result = subj.name;
                return false;
            }
            return true;
        });
        return result;
    }

    isSubjectUpdateDisabled(subject: any): boolean {
        if (subject.newEmployee.id !== subject.parentEmployee
            || subject.newMainSubject !== subject.mainSubject
            || subject.newOrderNumber !== subject.orderNumber
            || subject.newOnlyGrade !== subject.onlyGrade) {
            return false;
        }
        return true;
    }

}
