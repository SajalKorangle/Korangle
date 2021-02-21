import { Component, OnInit } from '@angular/core';

import { DataStorage } from './../../../../classes/data-storage';
import { GenerateReportCardServiceAdapter } from './generate-report-card.service.adapter';

import { ReportCardService } from '@services/modules/report-card/report-card.service';
import { StudentService } from '@services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';
import { ExaminationService } from '@services/modules/examination/examination.service';
import { SubjectService } from '@services/modules/subject/subject.service';
import {SchoolService} from '@services/modules/school/school.service';
import {AttendanceService} from '@services/modules/attendance/attendance.service';
import { GradeService } from '@services/modules/grade/grade.service';

import { PARAMETER_LIST, DPI_LIST } from './../../class/constants_3';
import { GenerateReportCardCanvasAdapter } from './generate-report-card.canvas.adapter';

import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-generate-report-card',
  templateUrl: './generate-report-card.component.html',
  styleUrls: ['./generate-report-card.component.css'],
  providers: [
    ReportCardService,
    StudentService,
    ClassService,
    ExaminationService,
    SubjectService,
    SchoolService,
    AttendanceService,
    GradeService,
  ]
})
export class GenerateReportCardComponent implements OnInit {

  user: any;

  htmlAdapter: any = {
    parameterList: [...PARAMETER_LIST]
  };

  dpiList: number[] = DPI_LIST;

  selectedLayout: { id?: any, parentSchool: string, name: string, thumbnail?:string, publiclyShared:boolean, content: any };
  reportCardLayoutList: {id?:any, parentSchool:string, name:string, thumbnail?:string, publiclyShared:boolean, content: any}[] = [];
  
  studentList: any[];
  studentSectionList: any[];
  classList: any[];
  divisionList: any[];

  classSectionList: any[] = [];
  filteredStudentSectionList: any[] = [];


  DATA: {
    studentId: number,
    currentSession: number,
    data: {
      school: any,
      studentList: any[],
      studentSectionList: any[],
      studentParameterList: any[],
      studentParameterValueList: any[],
      classList: any[],
      divisionList: any[],
      examinationList: any[],
      testList: any[],
      studentTestList: any[],
      subjectList: any[],
      attendanceList: any[],
      sessionList: any[],
      gradeList: any[],
      subGradeList: any[],
      studentSubGradeList: any[],
      studentExaminationRemarksList: any[],
      classSectionSignatureList: any[],
    }
  } = {
    studentId: null,
    currentSession: null,
    data: {
      school: null,
      studentList: [],
      studentSectionList: [],
      studentParameterList: [],
      studentParameterValueList: [],
      classList: [],
      divisionList: [],
      examinationList: [],
      testList: [],
      studentTestList: [],
      subjectList: [],
      attendanceList: [],
      sessionList: [],
      gradeList: [],
      subGradeList: [],
      studentSubGradeList: [],
      studentExaminationRemarksList: [],
      classSectionSignatureList: [],
    }
  }

  canvasAdapter: GenerateReportCardCanvasAdapter;
  serviceAdapter: GenerateReportCardServiceAdapter;

  generatedReportCards:number = 0;
  isLoading:boolean = false

  constructor(
    public reportCardService: ReportCardService,
    public studentService: StudentService,
    public classService: ClassService,
    public examinationService: ExaminationService,
    public subjectService: SubjectService,
    public schoolService: SchoolService,
    public attendanceService: AttendanceService,
    public gradeService: GradeService
  ) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.DATA.data.school = this.user.activeSchool;

    this.serviceAdapter = new GenerateReportCardServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();

    this.canvasAdapter = new GenerateReportCardCanvasAdapter();
    this.canvasAdapter.initilizeAdapter(this);
  }

  populateClassSectionList(classList, divisionList):void {
    this.classSectionList = [];
    classList.forEach(classs => {
        divisionList.forEach(division => {
            if (this.studentSectionList.find(studentSection => {
                    return studentSection.parentClass == classs.id
                        && studentSection.parentDivision == division.id;
                }) != undefined) {
                this.classSectionList.push({
                    class: classs,
                    section: division,
                    selected: false
                });
            }
        });
    });
  }

  selectAllClasses(): void{
    this.classSectionList.forEach(classSection => classSection.selected = true);
  }

  unselectAllClasses(): void{
    this.classSectionList.forEach(classSection => classSection.selected = false);
  }

  getStudent = id => this.studentList.find(x => x.id===id)
  getClass = id => this.classList.find(x => x.id===id)
  getDivision = id => this.divisionList.find(x => x.id === id)
  
  handleFilteredStudentSectionList = () => {
    this.filteredStudentSectionList = this.studentSectionList.filter(studentSection => {
        return this.classSectionList.find(classSection => {
            return classSection.selected && classSection.class.id===studentSection.parentClass && classSection.section.id===studentSection.parentDivision
        })
    })
  }

  selectAllStudents(): void{
    this.filteredStudentSectionList.forEach(studentSection => studentSection.selected = true);
  }

  clearAllStudents(): void{
    this.filteredStudentSectionList.forEach(studentSection => studentSection.selected = false);
  }

  getSelectedStudentList(): any[]{
    return this.filteredStudentSectionList.filter(studentSection => studentSection.selected);
  }

  async generateReportCard() {
    this.isLoading = true;
    this.generatedReportCards = 0;
    let selectedLayutContent = JSON.parse(this.selectedLayout.content);
    this.DATA.data.studentSectionList = this.getSelectedStudentList();
    this.DATA.data.studentList = this.DATA.data.studentSectionList.map(ss => this.studentList.find(s => s.id == ss.parentStudent));
    await this.serviceAdapter.getDataForGeneratingeportCard();

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    let doc = new jsPDF({ orientation: 'p', unit: 'pt' });
    doc.deletePage(1);
    for (let si = 0; si < this.DATA.data.studentList.length; si++){
      this.DATA.studentId = this.DATA.data.studentList[si].id;
      for (let i = 0; i < selectedLayutContent.length;i++){
        let layoutPage = selectedLayutContent[i];
        await this.canvasAdapter.loadData(layoutPage);
        await this.canvasAdapter.downloadPDF(doc);
      }
      this.generatedReportCards++;
      await sleep(10);
    }

    doc.save(this.selectedLayout.name + '.pdf');
    this.isLoading = false;
  }
}
