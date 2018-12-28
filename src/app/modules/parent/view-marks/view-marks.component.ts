import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { StudentService } from '../../students/student.service';
import {ExaminationService} from '../../../services/examination.service';
import {SubjectService} from '../../../services/subject.service';
import {ViewMarksServiceAdapter} from './view-marks.service.adapter';

@Component({
  selector: 'view-marks',
  templateUrl: './view-marks.component.html',
  styleUrls: ['./view-marks.component.css'],
    providers: [ StudentService, ExaminationService, SubjectService ],
})

export class ViewMarksComponent implements OnInit, OnChanges {

    @Input() user;

    @Input() studentId;

    serviceAdapter: ViewMarksServiceAdapter;

    selectedStudent: any;

    examinationList: any;

    selectedExamination: any;

    isLoading = false;

    constructor (public studentService: StudentService,
                 public examinationService: ExaminationService,
                 public subjectService: SubjectService) { }

    ngOnChanges(): void {
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.selectedStudent = null;

        this.isLoading = false;

        this.serviceAdapter = new ViewMarksServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);

        this.serviceAdapter.initializeData();

    }

    getTestGrade(test: any): any {
        return this.getGradeFromPercentage((test.marksObtained/test.maximumMarks)*100);
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
        if (percentage >=75) {
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
