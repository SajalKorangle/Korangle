import { Component, Input, OnInit } from '@angular/core';

import { ExaminationService } from '../../../../services/examination.service';
import { ClassService } from '../../../../services/class.service';
import { SubjectService } from '../../../../services/subject.service';

import { UpdateCceMarksServiceAdapter } from './update-cce-marks.service.adapter';
import {TEST_TYPE_LIST} from '../../classes/constants';
import {StudentOldService} from '../../../students/student-old.service';

import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'update-cce-marks',
    templateUrl: './update-cce-marks.component.html',
    styleUrls: ['./update-cce-marks.component.css'],
    providers: [ ExaminationService, ClassService, SubjectService, StudentOldService ],
})

export class UpdateCceMarksComponent implements OnInit {

    @Input() user;

    classStudentCCEMarksList: any;

    selectedClass: any;

    serviceAdapter: UpdateCceMarksServiceAdapter;

    isLoading = false;

    constructor(public examinationService: ExaminationService,
                public classService: ClassService,
                public subjectService: SubjectService,
                public studentService: StudentOldService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
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
