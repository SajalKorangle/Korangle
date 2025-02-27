import { Component, Input, OnInit } from '@angular/core';

import { SubjectOldService } from '../../../../services/modules/subject/subject-old.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import { SchoolService } from '../../../../services/modules/school/school.service';

import { SetStudentSubjectServiceAdapter } from './set-student-subject.service.adapter';
import { ExaminationOldService } from '../../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'set-student-subject',
    templateUrl: './set-student-subject.component.html',
    styleUrls: ['./set-student-subject.component.css'],
    providers: [SubjectOldService, ClassService, StudentOldService, SchoolService, ExaminationOldService, ExaminationService],
})
export class SetStudentSubjectComponent implements OnInit {
    user;

    serviceAdapter: SetStudentSubjectServiceAdapter;

    studentClassAllSubjectList: any;

    isSessionLoading = false;
    isLoading = false;

    isStudentListLoading = false;

    selectedStudent: any;
    selectedStudentSection: any;

    constructor(
        public subjectService: SubjectOldService,
        public classService: ClassService,
        public studentService: StudentOldService,
        public schoolService: SchoolService,
        public examinationOldService: ExaminationOldService,
        public examinationService: ExaminationService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SetStudentSubjectServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);

        this.serviceAdapter.initializeData();
        // this.serviceAdapter.initializeAdapter(this);
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
