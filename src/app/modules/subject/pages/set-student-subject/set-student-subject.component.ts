import { Component, Input, OnInit } from '@angular/core';

import { SubjectOldService } from '../../../../services/modules/subject/subject-old.service';
import { ClassOldService } from '../../../../services/modules/class/class-old.service';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import { SchoolService } from '../../../../services/modules/school/school.service';


import { SetStudentSubjectServiceAdapter } from './set-student-subject.service.adapter';
import {ExaminationOldService} from '../../../../services/modules/examination/examination-old.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'set-student-subject',
    templateUrl: './set-student-subject.component.html',
    styleUrls: ['./set-student-subject.component.css'],
    providers: [ SubjectOldService, ClassOldService, StudentOldService, SchoolService, ExaminationOldService ],
})

export class SetStudentSubjectComponent implements OnInit {

    user;

    serviceAdapter: SetStudentSubjectServiceAdapter;

    studentClassAllSubjectList: any;

    isSessionLoading = false;
    isLoading = false;

    selectedSession: any;

    selectedStudent: any;

    constructor(public subjectService: SubjectOldService,
                public classService: ClassOldService,
                public studentService: StudentOldService,
                public schoolService: SchoolService,
                public examinationService: ExaminationOldService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SetStudentSubjectServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);

        this.selectedSession = {
            'id': this.user.activeSchool.currentSessionDbId,
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
