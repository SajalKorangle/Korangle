import { Component, Input, OnInit } from '@angular/core';

import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { ClassService } from '../../../../services/modules/class/class.service';

import { UpdateMarksServiceAdapter } from './update-marks.service.adapter';
import {TEST_TYPE_LIST} from '../../../../classes/constants/test-type';

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { SubjectService } from 'app/services/modules/subject/subject.service';
import { StudentService } from 'app/services/modules/student/student.service';

@Component({
    selector: 'update-class-marks',
    templateUrl: './update-marks.component.html',
    styleUrls: ['./update-marks.component.css'],
    providers: [ClassService, SubjectService, ExaminationService, StudentService],
})

export class UpdateMarksComponent implements OnInit {

   user;

    showTestDetails = false;

    selectedExamination: any;
    examinationClassSectionSubjectList: any;

    student_mini_profile_list: any = [];

    subjectList: any;

    testTypeList = TEST_TYPE_LIST;

    serviceAdapter: UpdateMarksServiceAdapter;

    isInitialLoading = false;

    isLoading = false;
    isUpdated = false;

    constructor(public examinationService : ExaminationService,
                public classService: ClassService,
                public subjectService: SubjectService,
                public studentNewService: StudentService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

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

    handleUpdate(event: any, student: any): void {


        student.testDetails.forEach(item => {
            if (event != item.marksObtained) {
                item.newMarksObtained = event;

            }
        });

        this.activateUpdate();

    }
    activateUpdate(): void {
        var updateCheck = false;

        let student_list = this.getFilteredStudentList(this.selectedExamination.selectedClass.selectedSection.selectedSubject.studentList);

        student_list.forEach(st => {
            st.testDetails.forEach(test => {
                if (test.newMarksObtained != test.marksObtained)
                    updateCheck = true;;
            });
        });

        if (updateCheck)
            this.isUpdated = true;
        else
            this.isUpdated = false;
    }

}
