import { Component, Input, OnInit } from '@angular/core';

import { SubjectService } from '../../../../services/subject.service';
import { ClassService } from '../../../../services/class.service';
import { StudentService } from '../../../students/student.service';
import { SchoolService } from '../../../../services/school.service';


import { SetClassSubjectServiceAdapter } from './set-class-subject.service.adapter';

@Component({
    selector: 'set-class-subject',
    templateUrl: './set-class-subject.component.html',
    styleUrls: ['./set-class-subject.component.css'],
    providers: [ SubjectService, ClassService, StudentService, SchoolService ],
})

export class SetClassSubjectComponent implements OnInit {

    @Input() user;

    serviceAdapter: SetClassSubjectServiceAdapter;

    isSessionLoading = false;
    isLoading = false;

    selectedSession: any;
    selectedSubject = null;

    selectedClass: any;
    classSectionSubjectList: any;

    subjectList: any;
    filteredSubjectList: any;
    sessionList: any;

    constructor(public subjectService: SubjectService,
                public classService: ClassService,
                public studentService: StudentService,
                public schoolService: SchoolService) {}

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

}
