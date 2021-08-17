import { Component, OnInit, OnChanges } from '@angular/core';

import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import { ExaminationOldService } from '../../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { SubjectOldService } from '../../../../services/modules/subject/subject-old.service';
import { ViewMarksServiceAdapter } from './view-marks.service.adapter';
import { OnlineClassService } from '@services/modules/online-class/online-class.service';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'view-marks',
    templateUrl: './view-marks.component.html',
    styleUrls: ['./view-marks.component.css'],
    providers: [OnlineClassService, ExaminationService, StudentOldService, ExaminationOldService, SubjectOldService],
})
export class ViewMarksComponent implements OnInit, OnChanges {
    user;

    activeStudent: any;

    serviceAdapter: ViewMarksServiceAdapter;

    selectedStudent: any;

    examinationList: any;

    selectedExamination: any;

    isLoading = false;

    restrictedStudent = null;

    constructor(
        public onlineClassService: OnlineClassService,
        public studentService: StudentOldService,
        public examinationOldService: ExaminationOldService,
        public examinationService: ExaminationService,
        public subjectService: SubjectOldService
    ) {}

    ngOnChanges(): void {
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.activeStudent = this.user.section.student;
        this.restrictedStudent = this.activeStudent.isRestricted;

        this.selectedStudent = null;

        this.isLoading = false;

        this.serviceAdapter = new ViewMarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);

        if (!this.restrictedStudent) { //fetches data only if the student is not restricted
            this.serviceAdapter.initializeData();
        }
    }

    getTestGrade(test: any): any {
        return this.getGradeFromPercentage((test.marksObtained / test.maximumMarks) * 100);
    }

    getTotalMaximumMarks(marksList: any): any {
        let result = 0;
        marksList.forEach((item) => {
            result += parseFloat(item.maximumMarks);
        });
        return result;
    }

    getTotalMarksObtained(marksList: any): any {
        let result = 0;
        marksList.forEach((item) => {
            result += parseFloat(item.marksObtained);
        });
        return result;
    }

    getOverallGrade(marksList: any): any {
        return this.getGradeFromPercentage((this.getTotalMarksObtained(marksList) / this.getTotalMaximumMarks(marksList)) * 100);
    }

    getGradeFromPercentage(percentage: any): any {
        if (percentage >= 75) {
            return 'A';
        } else if (percentage >= 60) {
            return 'B';
        } else if (percentage >= 45) {
            return 'C';
        } else if (percentage >= 33) {
            return 'D';
        } else {
            return 'E';
        }
    }
}
