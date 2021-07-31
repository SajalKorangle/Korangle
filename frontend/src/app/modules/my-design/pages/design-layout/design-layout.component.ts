import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataStorage } from '../../../../classes/data-storage';


// Backend Services
import { ReportCardService } from '@services/modules/report-card/report-card.service';
import { StudentService } from '@services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';
import { ExaminationService } from '@services/modules/examination/examination.service';
import { SubjectService } from '@services/modules/subject/subject.service';
import { SchoolService } from '@services/modules/school/school.service';
import { AttendanceService } from '@services/modules/attendance/attendance.service';
import { GradeService } from '@services/modules/grade/grade.service';

// For Types
import { User } from '@classes/user';

import { DesignLayoutHtmlRenderer } from './design-layout.html.renderer';
import { DesignLayoutServiceAdapter } from './design-layout.service.adapter';

@Component({
  selector: 'app-design-layout',
  templateUrl: './design-layout.component.html',
  styleUrls: ['./design-layout.component.css'],
  providers: [
    ReportCardService,
    StudentService,
    ClassService,
    ExaminationService,
    SubjectService,
    SchoolService,
    AttendanceService,
    GradeService,
    MatDialog,
  ],
})
export class DesignLayoutComponent implements OnInit {

  user: User;

  backendData: {
    layoutList: Array<any>,
  } = {
      layoutList: null,
    };

  serviceAdapter: DesignLayoutServiceAdapter;
  htmlRenderer: DesignLayoutHtmlRenderer;

  constructor(
    public reportCardService: ReportCardService,
    public studentService: StudentService,
    public classService: ClassService,
    public examinationService: ExaminationService,
    public subjectService: SubjectService,
    public schoolService: SchoolService,
    public attendanceService: AttendanceService,
    public gradeService: GradeService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new DesignLayoutServiceAdapter(this);
    this.htmlRenderer = new DesignLayoutHtmlRenderer(this);

    this.serviceAdapter.initilizeDate();
  }

}
