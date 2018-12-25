import { Component, Input, OnInit } from '@angular/core';

import { ExaminationService } from '../../../../services/examination.service';
import { ClassService } from '../../../../services/class.service';
import { SubjectService } from '../../../../services/subject.service';

import { UpdateMarksServiceAdapter } from './update-marks.service.adapter';
import {TEST_TYPE_LIST} from '../../classes/constants';
import {StudentService} from '../../../students/student.service';

import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'update-class-marks',
    templateUrl: './update-marks.component.html',
    styleUrls: ['./update-marks.component.css'],
    providers: [ ExaminationService, ClassService, SubjectService, StudentService ],
})

export class UpdateMarksComponent implements OnInit {

    @Input() user;

    showTestDetails = false;

    selectedExamination: any;
    examinationClassSectionSubjectList: any;

    student_mini_profile_list: any;

    subjectList: any;

    testTypeList = TEST_TYPE_LIST;

    serviceAdapter: UpdateMarksServiceAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(public examinationService: ExaminationService,
                public classService: ClassService,
                public subjectService: SubjectService,
                public studentService: StudentService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new UpdateMarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.showTestDetails = false;
        this.cdRef.detectChanges();
    }

    getStudentName(studentId: any): any {
        let result = '';
        this.student_mini_profile_list.every(item => {
            if (item.dbId === studentId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getFilteredStudentList(list: any): any {
        return list.filter(item => {
            if (item.parentTransferCertificate === null) {
                return true;
            }
            return false;
        })
    }

}
