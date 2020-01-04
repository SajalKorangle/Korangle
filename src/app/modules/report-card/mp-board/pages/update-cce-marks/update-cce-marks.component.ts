import { Component, Input, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../../services/modules/examination/examination-old.service';
import { ClassService } from '../../../../../services/modules/class/class.service';
import { SubjectOldService } from '../../../../../services/modules/subject/subject-old.service';

import { UpdateCceMarksServiceAdapter } from './update-cce-marks.service.adapter';
import {TEST_TYPE_LIST} from '../../../../../classes/constants/test-type';
import {StudentOldService} from '../../../../../services/modules/student/student-old.service';

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../../classes/data-storage";

@Component({
    selector: 'update-cce-marks',
    templateUrl: './update-cce-marks.component.html',
    styleUrls: ['./update-cce-marks.component.css'],
    providers: [ ExaminationOldService, ClassService, SubjectOldService, StudentOldService ],
})

export class UpdateCceMarksComponent implements OnInit {

    user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: UpdateCceMarksServiceAdapter;

    isLoading = false;

    constructor(public examinationService: ExaminationOldService,                
                public classService : ClassService,
                public subjectService: SubjectOldService,
                public studentService: StudentOldService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new UpdateCceMarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
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
