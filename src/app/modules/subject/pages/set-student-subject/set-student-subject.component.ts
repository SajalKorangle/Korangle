import { Component, Input, OnInit } from '@angular/core';

import { SubjectService } from '../../../../services/subject.service';
import { ClassService } from '../../../../services/class.service';
import { StudentOldService } from '../../../students/student-old.service';
import { SchoolService } from '../../../../services/school.service';


import { SetStudentSubjectServiceAdapter } from './set-student-subject.service.adapter';
import {ExaminationService} from '../../../../services/examination.service';

@Component({
    selector: 'set-student-subject',
    templateUrl: './set-student-subject.component.html',
    styleUrls: ['./set-student-subject.component.css'],
    providers: [ SubjectService, ClassService, StudentOldService, SchoolService, ExaminationService ],
})

export class SetStudentSubjectComponent implements OnInit {

    @Input() user;

    serviceAdapter: SetStudentSubjectServiceAdapter;

    studentClassAllSubjectList: any;

    isSessionLoading = false;
    isLoading = false;

    selectedSession: any;

    selectedStudent: any;

    constructor(public subjectService: SubjectService,
                public classService: ClassService,
                public studentService: StudentOldService,
                public schoolService: SchoolService,
                public examinationService: ExaminationService) {}

    ngOnInit(): void {
        this.serviceAdapter = new SetStudentSubjectServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);

        this.selectedSession = {
            'dbId': this.user.activeSchool.currentSessionDbId,
        };

        this.serviceAdapter.initializeData();
        // this.serviceAdapter.initializeAdapter(this);
    }

    populateSelectedSession(item: any): void {
        this.selectedSession = item;
    }

    /*getFilteredSubjectList(): void {
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
    }*/

}
