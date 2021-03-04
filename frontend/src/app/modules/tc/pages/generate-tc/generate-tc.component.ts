import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";

import { GenerateTCServiceAdapter } from './generate-tc.service.adapter';

import { TCService } from '@services/modules/tc/tc.service';
import { StudentService } from '@services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';
import { SubjectService } from '@services/modules/subject/subject.service';
import {SchoolService} from '@services/modules/school/school.service';
import {AttendanceService} from '@services/modules/attendance/attendance.service';

import { PARAMETER_LIST, DPI_LIST } from './../../class/constants';
import { GenerateTCCanvasAdapter } from './generate-tc.canvas.adapter';

import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-generate-tc',
  templateUrl: './generate-tc.component.html',
  styleUrls: ['./generate-tc.component.css'],
  providers: [
    TCService,
    StudentService,
    ClassService,
    SubjectService,
    SchoolService,
    AttendanceService,
  ]
})
export class GenerateTCComponent implements OnInit {
  
  user: any;

  htmlAdapter: any = {
    parameterList: [...PARAMETER_LIST]
  };

  dpiList: number[] = DPI_LIST;

  selectedLayout: { id?: any, parentSchool: string, name: string, thumbnail?:string, publiclyShared:boolean, content: any, parentStudentSection?:number };
  tcLayoutList: { id?: any, parentSchool: string, name: string, thumbnail?:string, publiclyShared:boolean, content: any, parentStudentSection?:number }[] = [];

  studentList: any[];
  studentSectionList: any[];
  classList: any[];
  divisionList: any[];

  classSectionList: any[] = [];
  filteredStudentSectionList: any[] = [];

  issueDate: any;
  leavingDate: any;
  isLeavingSchoolBecause: string;

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
      subjectList: any[],
      attendanceList: any[],
      sessionList: any[],
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
      subjectList: [],
      attendanceList: [],
      sessionList: [],
      classSectionSignatureList: [],
    }
    }
  
  canvasAdapter: GenerateTCCanvasAdapter;
  serviceAdapter: GenerateTCServiceAdapter;

  generatedReportCards: number = 0;
  estimatedTime: any = null;


  isLoading:boolean = false;


  constructor(
    public tcService: TCService,
    public studentService: StudentService,
    public classService: ClassService,
    public subjectService: SubjectService,
    public schoolService: SchoolService,
    public attendanceService: AttendanceService,
  ) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.DATA.data.school = this.user.activeSchool;

    this.serviceAdapter = new GenerateTCServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();

    this.canvasAdapter = new GenerateTCCanvasAdapter();
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

  async generateTC() {
    this.isLoading = true;
    this.generatedReportCards = 0;
    this.estimatedTime = null;
    let selectedLayutContent = JSON.parse(this.selectedLayout.content);
    this.DATA.data.studentSectionList = this.getSelectedStudentList();
    this.DATA.data.studentList = this.DATA.data.studentSectionList.map(ss => this.studentList.find(s => s.id == ss.parentStudent));
    await this.serviceAdapter.getDataForGeneratingTC();
    
    let doc = new jsPDF({ orientation: 'p', unit: 'pt' });
    doc.deletePage(1);
    let stratTime: any = new Date();
    let startSerialNo
    if(this.DATA.data.studentSectionList.length>0)
      startSerialNo = this.filteredStudentSectionList.findIndex(ss=>ss.id == this.DATA.data.studentSectionList[0].id)+1;
    let si;
    for (si = 0; si < this.DATA.data.studentList.length; si++){
      this.DATA.studentId = this.DATA.data.studentList[si].id;
      for (let i = 0; i < selectedLayutContent.length; i++){

        if (doc.output('blob').size > (300 * 1024*1024)) {
          let endSerialNo;
          if (i == 0) // last iteration serial no
            endSerialNo = this.filteredStudentSectionList.findIndex(ss => ss.id == this.DATA.data.studentSectionList[si - 1].id)+1;
          else
            endSerialNo = this.filteredStudentSectionList.findIndex(ss => ss.id == this.DATA.data.studentSectionList[si].id)+1;
          doc.save(this.selectedLayout.name + `(${startSerialNo}-${endSerialNo})` + '.pdf');
          doc = new jsPDF({ orientation: 'p', unit: 'pt' });
          doc.deletePage(1);
          startSerialNo = this.filteredStudentSectionList.findIndex(ss => ss.id == this.DATA.data.studentSectionList[si].id)+1;
        }

        let layoutPage = selectedLayutContent[i];
        await this.canvasAdapter.loadData(layoutPage);
        await this.canvasAdapter.downloadPDF(doc);
      }
      this.generatedReportCards++;
      let currTime:any = new Date();
      let timeTakenPerStudent: any = ((currTime - stratTime)) / (1000*(si+1));  // converting to seconds
      let estimatedTime = timeTakenPerStudent * (this.DATA.data.studentList.length - si - 1); // in seconds
      let secLeft = Math.ceil((estimatedTime) % 60);
      let minutesleft = Math.floor(estimatedTime / 60);
      this.estimatedTime = { minutes: minutesleft, seconds: secLeft };
    }

    if (startSerialNo != this.filteredStudentSectionList.findIndex(ss => ss.id == this.DATA.data.studentSectionList[0].id)+1) {
      let endSerialNo = this.filteredStudentSectionList.findIndex(ss => ss.id == this.DATA.data.studentSectionList[si-1].id)
      doc.save(this.selectedLayout.name+`(${startSerialNo}-${endSerialNo})` + '.pdf');
    } else {
      doc.save(this.selectedLayout.name + '.pdf');
    }
   
    this.isLoading = false;
  }

}
