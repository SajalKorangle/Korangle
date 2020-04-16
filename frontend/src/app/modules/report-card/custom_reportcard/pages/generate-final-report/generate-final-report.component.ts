import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { isMobile } from '../../../../../classes/common.js'
import {DataStorage} from '../../../../../classes/data-storage';

import {GenerateFinalReportServiceAdapter} from './generate-final-report.service.adapter';

import {CustomReportCardService} from '../../../../../services/modules/custom_reportcard/custom_reportcard.service';
import {ClassService} from '../../../../../services/modules/class/class.service';
import {GradeService} from '../../../../../services/modules/grade/grade.service';
import {ExaminationService} from '../../../../../services/modules/examination/examination.service';
import {AttendanceService} from '../../../../../services/modules/attendance/attendance.service';
import {StudentService} from '../../../../../services/modules/student/student.service';
import {SubjectService} from '../../../../../services/modules/subject/subject.service';
import {SchoolService} from '../../../../../services/modules/school/school.service';

import {PRINT_CUSTOM_REPORTCARD } from '../../../../../print/print-routes.constants';
import { PrintService } from '../../../../../print/print-service';


@Component({
  selector: 'app-generate-final-report',
  templateUrl: './generate-final-report.component.html',
  styleUrls: ['./generate-final-report.component.css'],
  providers:[
      CustomReportCardService,
      ClassService,
      GradeService,
      ExaminationService,
      StudentService,
      SubjectService,
      AttendanceService,
      SchoolService,
  ]
})

export class GenerateFinalReportComponent implements OnInit {

  user;

  // class
  classList:any;
  divisionList:any;
  
  // custom report card
  layoutList:any;
  classLayoutList:any;
  layoutExamColumnList:any;
  layoutGradeList:any;
  layoutSubGradeList:any;

  // grade
  gradeList:any;
  subGradeList:any;

  // examination
  examinationList:any;
  testSecondList:any;
  
  // student
  studentList:any[];
  studentSectionList:any[];
  studentSubjectList:any[];
  
  //subject
  subjectList:any[];

  // session
  sessionList: any[];

  // Class Teacher Signatures
  classTeacherSignatureList: any[];

  selectedStudentList:any = [];
  selectedClass:any = null;
  selectedDivision:any = null;


  classSectionList:any = [];
  serviceAdapter: GenerateFinalReportServiceAdapter;
  isLoading:Boolean;

  constructor(public customReportCardService:CustomReportCardService,
              public classService:ClassService,
              public gradeService:GradeService,
              public examinationService:ExaminationService,
              public studentService:StudentService,
              public subjectService:SubjectService,
              public attendanceService:AttendanceService,
              public schoolService:SchoolService,
              private printService:PrintService,
              private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new GenerateFinalReportServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  getFilteredClassList(){
    if(this.classLayoutList.length == 0) return [];

    let list = this.classList.filter(classs=>{
      return this.classLayoutList.find(item=>{return item.parentClass == classs.id}) != undefined;
    });

    return list;

  }

  getFilteredSectionList(classs){
    
    let list =  this.divisionList.filter(division=>{
      return this.studentSectionList.every(item=>{
        return !(item.parentClass == classs.id && item.parentDivision == division.id);
      }) == false;
    });

    if(list.length == 0) return [];

    return list;
  }

  populateClassSectionList(){
    let classList = this.getFilteredClassList();


    classList.forEach(classs=>{
      let sectionList = this.getFilteredSectionList(classs);
      
      sectionList.forEach(section=>{
        this.classSectionList.push({'class':classs,'section':section});
      });
    });

  }

  getSelectedValue(){
    if(this.selectedClass == null || this.selectedDivision == null) return '';

    return this.selectedClass.name + ',' + this.selectedDivision.name;
  }

  // Returns students of selected class and selected division
  getFilteredStudentList():any[]{
    if(this.selectedClass == null || this.selectedDivision == null) return [];

    let temp = [];

    this.studentSectionList.filter(item=>{
      return item.parentClass == this.selectedClass.id && item.parentDivision == this.selectedDivision.id;
    }).forEach(item=>{
      let student = this.studentList.find(item1=>{ return item.parentStudent == item1.id;});
      if(student != undefined) temp.push(student);
    });

    return temp;

  }

  getStudentRollNo(student):any{
    let temp = this.studentSectionList.find(item=>{return item.parentStudent == student.id});

    if(temp == undefined) return '';
    return temp.rollNumber;
  }

  isStudentSelected(student):Boolean{
    return this.selectedStudentList.find(item=>{
      return item.id == student.id;
    }) != undefined;
  }

  updateSelectedStudentList(student,event){
    if(event == true){
      this.selectedStudentList.push(student);
    }else{
      this.selectedStudentList = this.selectedStudentList.filter(item=>{
        return item.id != student.id;
      });
    }
  }

  printReportCard(data){
    this.printService.navigateToPrintRoute(PRINT_CUSTOM_REPORTCARD,{user:this.user,value:data});
  }

  updateClassSectionChange(value){
    this.selectedClass = value.class;
    this.selectedDivision = value.section;
  }

  selectAllStudents(){
    let student_list = this.getFilteredStudentList();
    this.selectedStudentList = student_list;
  }
}
