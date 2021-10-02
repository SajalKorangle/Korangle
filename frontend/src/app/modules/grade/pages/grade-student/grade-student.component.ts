import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { GradeStudentServiceAdapter } from './grade-student.service.adapter';
import { GradeService } from '../../../../services/modules/grade/grade.service';
import { AttendanceService } from '../../../../services/modules/attendance/attendance.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { ExaminationService } from '@services/modules/examination/examination.service';
import {valueType} from '@modules/common/in-page-permission';
import {ADMIN_PERMSSION, USER_PERMISSION_KEY} from './grade-student.permissions';
import {EmployeeService} from '@services/modules/employee/employee.service';

@Component({
    selector: 'app-grade-student',
    templateUrl: './grade-student.component.html',
    styleUrls: ['./grade-student.component.css'],
    providers: [GradeService, ClassService, AttendanceService, StudentService, ExaminationService, EmployeeService],
})
export class GradeStudentComponent implements OnInit {
    user;

    isLoading = false;
    isInitialLoading = false;
    showTestDetails = false;

    serviceAdapter: GradeStudentServiceAdapter;
    inPagePermissionMappedByKey: { [key: string]: valueType; };

    classList = [];
    sectionList = [];

    selectedClassSection = null;
    filteredClassSectionList = [];
    attendancePermissionList = [];

    selectedExamination = null;
    examinationList = [];

    selectedGrade = null;
    gradeList = [];
    studentList = [];

    constructor(
        public gradeService: GradeService,
        public examinationService: ExaminationService,
        public studentService: StudentService,
        public attendanceService: AttendanceService,
        public classService: ClassService,
        private cdRef: ChangeDetectorRef,
        public employeeService: EmployeeService
    ) {}

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
        return this.studentList.filter((student) => {
            return (
                student.studentSection.parentClass === this.selectedClassSection.class.id &&
                student.studentSection.parentDivision === this.selectedClassSection.section.id
            );
        });
    }

    hasAdminPermission(): boolean {
        return this.inPagePermissionMappedByKey[USER_PERMISSION_KEY] == ADMIN_PERMSSION;
    }

    /*selectClass(classs: any){
    this.selectedClass = classs;
    this.showTestDetails = false;
    this.selectedSection = this.getSectionList(this.selectedClass)[0].id;
  }*/

    /*getFilteredClassList() {
    if(this.attendancePermissionList.length > 0){
      return this.classList.filter(classs =>{
        if(this.attendancePermissionList.find(attendencePermission => {
          return attendencePermission.parentClass == classs.id;
        }) != undefined ){
          return true;
        }
        return false;
      });
    }
    else{
      return [];
    }
  }

  getSectionList(classs: any){
    let allSections = this.attendancePermissionList.filter(attendencePermission => {
      return attendencePermission.parentClass == classs;
    });
    if(allSections.length > 0){
      return this.sectionList.filter(section =>{
        if(allSections.find(sectionn => {
          return sectionn.parentDivision == section.id;
        }) != undefined ){
          return true;
        }
        return false;
      });
    }
    else{
      return [];
    }
  }*/
}
