import { Component, Input, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../services/modules/examination/examination-old.service';
import { ClassOldService } from '../../../../services/modules/class/class-old.service';
import { SubjectOldService } from '../../../../services/modules/subject/subject-old.service';

import { CreateTestServiceAdapter } from './create-test.service.adapter';
import {TEST_TYPE_LIST} from '../../../../classes/constants/test-type';
import {StudentOldService} from '../../../../services/modules/student/student-old.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'create-test',
    templateUrl: './create-test.component.html',
    styleUrls: ['./create-test.component.css'],
    providers: [ ExaminationOldService, ClassOldService, SubjectOldService, StudentOldService ],
})

export class CreateTestComponent implements OnInit {

    user;

    showTestDetails = false;

    selectedExamination: any;
    examinationClassSectionList: any;

    subjectList: any;

    // For New Test
    selectedSubject: any;
    selectedDate = null;
    selectedStartTime = "10:30";
    selectedEndTime = "13:30";
    selectedTestType = null;
    selectedMaximumMarks = 100;

    testTypeList = TEST_TYPE_LIST;

    serviceAdapter: CreateTestServiceAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(public examinationService: ExaminationOldService,
                public classService: ClassOldService,
                public subjectService: SubjectOldService,
                public studentService: StudentOldService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new CreateTestServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    onDateSelected(event: any): void {
        this.selectedDate = this.formatDate(event, '');
    }

    formatDate(dateStr: any, status: any): any {

        let d = new Date(dateStr);

        if (status === 'firstDate') {
            d = new Date(d.getFullYear(), d.getMonth(), 1);
        } else if (status === 'lastDate') {
            d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getTestDate(test: any): any {
        return new Date(test.startTime);
    }

    onTestDateUpdation(test: any, event: any): void {
        test.newDate = this.formatDate(event, '');
    }

    isTestUpdateDisabled(test: any): boolean {
        if (test.startTime !== test.newDate + "T" + test.newStartTime +':00+05:30') {
            return false;
        }
        if (test.endTime !== test.newDate + "T" + test.newEndTime +':00+05:30') {
            return false;
        }
        if (test.newMaximumMarks !== test.maximumMarks) {
            return false;
        }
        return true;
    }

}
