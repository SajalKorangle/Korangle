import { Component, OnInit, OnChanges } from '@angular/core';

import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import {ExaminationOldService} from '../../../../services/modules/examination/examination-old.service';
import {SubjectOldService} from '../../../../services/modules/subject/subject-old.service';
import {ViewMarksServiceAdapter} from './view-marks.service.adapter';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'view-marks',
  templateUrl: './view-marks.component.html',
  styleUrls: ['./view-marks.component.css'],
    providers: [ StudentOldService, ExaminationOldService, SubjectOldService ],
})

export class ViewMarksComponent implements OnInit, OnChanges {

     user;

    serviceAdapter: ViewMarksServiceAdapter;

    selectedStudent: any;

    examinationList: any;

    selectedExamination: any;

    isLoading = false;

    constructor (public studentService: StudentOldService,
                 public examinationOldService: ExaminationOldService,
                 public subjectService: SubjectOldService) { }

    ngOnChanges(): void {
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.selectedStudent = null;

        this.isLoading = false;

        this.serviceAdapter = new ViewMarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);

        this.serviceAdapter.initializeData();

    }

    getTestGrade(test: any): any {
        return this.getGradeFromPercentage((test.marksObtained / test.maximumMarks) * 100);
    }

    getTotalMaximumMarks(marksList: any): any {
        let result = 0;
        marksList.forEach(item => {
            result += parseFloat(item.maximumMarks);
        });
        return result;
    }

    getTotalMarksObtained(marksList: any): any {
        let result = 0;
        marksList.forEach(item => {
            result += parseFloat(item.marksObtained);
        });
        return result;
    }

    getOverallGrade(marksList: any): any {
        return this.getGradeFromPercentage((this.getTotalMarksObtained(marksList)/this.getTotalMaximumMarks(marksList))*100);
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
