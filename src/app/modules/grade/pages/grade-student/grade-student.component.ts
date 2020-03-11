import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataStorage} from '../../../../classes/data-storage';
import { GradeStudentServiceAdapter } from './grade-student.service.adapter';
import { GradeService } from '../../../../services/modules/grade/grade.service';
import {AttendanceService} from '../../../../services/modules/attendance/attendance.service';
import {ClassService} from '../../../../services/modules/class/class.service';
import {StudentService} from '../../../../services/modules/student/student.service';

@Component({
  selector: 'app-grade-student',
  templateUrl: './grade-student.component.html',
  styleUrls: ['./grade-student.component.css'],
  providers:[
      GradeService,
    ClassService,
    AttendanceService,
      StudentService
  ]
})
export class GradeStudentComponent implements OnInit {

  user;

  isLoading = false;
  isInitialLoading = false;
  showTestDetails = false;

  serviceAdapter: GradeStudentServiceAdapter;

  classList = [];
  sectionList = [];
  selectedClass = null ;
  selectedSection = null;
  attendencePermissionList = [];
  gradeList = [];
  selectedGrade = null;
  // subGradeList = [];
  studentList = [];

  constructor(public gradeService:GradeService,
              public studentService: StudentService,
              public attendanceService : AttendanceService,
              public classService : ClassService,
              private cdRef: ChangeDetectorRef,) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new GradeStudentServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  detectChanges(): void {
    this.showTestDetails = false;
    this.cdRef.detectChanges();
  }

  getFilteredStudentList(): any {
    return this.studentList.filter(student => {
      return student.studentSection.parentClass == this.selectedClass
          && student.studentSection.parentDivision == this.selectedSection;
    });
  }

  selectClass(classs: any){
    this.selectedClass = classs;
    this.showTestDetails = false;
    this.selectedSection = this.serviceAdapter.getSectionList(this.selectedClass)[0].id;
  }

}
