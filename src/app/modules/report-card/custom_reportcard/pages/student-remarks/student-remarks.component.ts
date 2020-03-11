import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { isMobile } from '../../../../../classes/common.js'

import {CustomReportCardService} from '../../../../../services/modules/custom_reportcard/custom_reportcard.service';
import {DataStorage} from '../../../../../classes/data-storage';
import {StudentRemarksServiceAdapter} from './student-remarks.service.adapter';
import {ReportCardMpBoardService} from '../../../../../services/modules/report-card/mp-board/report-card-mp-board.service';
import {ClassService} from '../../../../../services/modules/class/class.service';
import {EmployeeService} from '../../../../../services/modules/employee/employee.service';
import {AttendanceService} from '../../../../../services/modules/attendance/attendance.service';
import {StudentService} from '../../../../../services/modules/student/student.service';
import {ExaminationService} from '../../../../../services/modules/examination/examination.service';

declare const $: any;

@Component({
  selector: 'app-student-remarks',
  templateUrl: './student-remarks.component.html',
  styleUrls: ['./student-remarks.component.css'],
  providers:[
      CustomReportCardService,
      ReportCardMpBoardService,
      ExaminationService,
      ClassService,
      EmployeeService,
      AttendanceService,
      StudentService
  ]
})
export class StudentRemarksComponent implements OnInit {

  user;

  classSectionList = [];
  attendancePermissionList = [];
  studentSectionList = [];
  studentRemarkList = [];

  selectedClassSection: any;

  showStudentList = false;

  serviceAdapter: StudentRemarksServiceAdapter;
  isInitialLoading = false;

  isLoading = false;

  constructor(public customReportCardService:CustomReportCardService,
              public reportCardMpBoardService: ReportCardMpBoardService,
              public classService: ClassService,
              public employeeService: EmployeeService,
              public attendanceService: AttendanceService,
              public studentService: StudentService,
              private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new StudentRemarksServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  handleClassSectionChange(classSection: any): void {
    this.selectedClassSection = classSection;
  }

  getFilteredStudentSectionList(): any {

    return this.studentSectionList.filter(studentSection => {
      return studentSection.parentClass == this.selectedClassSection.class.id
          && studentSection.parentDivision == this.selectedClassSection.section.id;
    }).sort( (a,b) => {
      if (a.rollNumber && b.rollNumber) {
        return a.rollNumber - b.rollNumber;
      }
    });
  }

  getTotalStudentsCount(): any {
    return this.getFilteredStudentSectionList().length;
  }

  getRemarkedStudentsCount(): any {
    return this.studentRemarkList.filter(item=>{
      if(item.remark != '') return true;
      return false;
    }).length;
  }

  getStudentRemark(studentSection: any): any {
    let item = this.studentRemarkList.find(studentRemark => {
      return studentRemark.parentStudent == studentSection.parentStudent;
    });
    if (item) {
      return item.remark;
    } else {
      return '';
    }
  }

  isMobile(): boolean {
    //return isMobile();
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }


}
