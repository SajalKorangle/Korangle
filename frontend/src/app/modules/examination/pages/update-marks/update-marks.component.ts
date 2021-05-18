import { Component, Input, OnInit, Renderer2 } from '@angular/core';

import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { ClassService } from '../../../../services/modules/class/class.service';

import { UpdateMarksServiceAdapter } from './update-marks.service.adapter';
import { TEST_TYPE_LIST } from '../../../../classes/constants/test-type';

import { ChangeDetectorRef } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { SubjectService } from 'app/services/modules/subject/subject.service';
import { StudentService } from 'app/services/modules/student/student.service';
import { UpdateMarksHtmlRenderer } from './update-marks.html.renderer';

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
    htmlRenderer: UpdateMarksHtmlRenderer;

    isInitialLoading = false;

    isLoading = false;
    isUpdated = false;

    constructor(
        public examinationService: ExaminationService,
        public classService: ClassService,
        public subjectService: SubjectService,
        public studentService: StudentService,
        private cdRef: ChangeDetectorRef,
        public renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new UpdateMarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.htmlRenderer = new UpdateMarksHtmlRenderer();
        this.htmlRenderer.initialize(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.showTestDetails = false;
        this.cdRef.detectChanges();
    }

    getStudentName(studentId: any): any {
        let result = '';
        this.student_mini_profile_list.every((item) => {
            if (item.dbId === studentId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getFilteredStudentList(list: any): any {
        return list.filter((item) => {
            if (item.parentTransferCertificate === null) {
                return true;
            }
            return false;
        });
    }

    handleUpdate(studentTest: any, event: any): void {
        if (studentTest.absent) {
            studentTest.marksObtained = null;
        }
        if (studentTest.marksObtained != null) {
            studentTest.marksObtained = Math.round(studentTest.marksObtained * 1000) / 1000;
        }
        if (event != undefined) {
            this.renderer.addClass(event.target, 'updatingField')
        }
        if (studentTest.id == null) {
            this.serviceAdapter.createStudentTestDetails(studentTest, event);
        }
        else {
            this.serviceAdapter.updateStudentTestDetails(studentTest, event);
        }
    }
}
