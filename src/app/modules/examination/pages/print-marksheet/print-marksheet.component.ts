import { Component, Input, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../services/examination-old.service';
import { ClassService } from '../../../../services/class.service';
import { SubjectOldService } from '../../../../services/subject-old.service';

import { PrintMarksheetServiceAdapter } from './print-marksheet.service.adapter';
import {TEST_TYPE_LIST} from '../../classes/constants';
import {StudentOldService} from '../../../students/student-old.service';

import { ChangeDetectorRef } from '@angular/core';
import {EmitterService} from '../../../../services/emitter.service';

@Component({
    selector: 'examination-print-marksheet',
    templateUrl: './print-marksheet.component.html',
    styleUrls: ['./print-marksheet.component.css'],
    providers: [ ExaminationOldService, ClassService, SubjectOldService, StudentOldService ],
})

export class PrintMarksheetComponent implements OnInit {

    @Input() user;

    showTestDetails = false;

    selectedExamination: any;
    examinationClassSectionList: any;

    student_full_profile_list: any;

    subjectList: any;

    testTypeList = TEST_TYPE_LIST;

    serviceAdapter: PrintMarksheetServiceAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(public examinationService: ExaminationOldService,
                public classService: ClassService,
                public subjectService: SubjectOldService,
                public studentService: StudentOldService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new PrintMarksheetServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.showTestDetails = false;
        this.cdRef.detectChanges();
    }

    getStudentName(studentId: any): any {
        let result = '';
        this.student_full_profile_list.every(item => {
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

    printMarksheet(): void {
        EmitterService.get('print-student-marksheet-list').emit(this.selectedExamination);
        alert('This may take a while');
    }

}
