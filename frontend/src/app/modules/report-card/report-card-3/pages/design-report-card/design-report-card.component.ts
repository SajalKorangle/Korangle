import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { DataStorage } from "../../../../../classes/data-storage";
import { FONT_FAMILY_LIST } from '@modules/report-card/class/font';

import { DesignReportCardServiceAdapter } from './design-report-card.service.adapter';

import { ReportCardService } from '@services/modules/report-card/report-card.service';
import { StudentService } from '@services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';
import { ExaminationService } from '@services/modules/examination/examination.service';
import { SubjectService } from '@services/modules/subject/subject.service';
import {SchoolService} from '@services/modules/school/school.service';
import {AttendanceService} from '@services/modules/attendance/attendance.service';
import {GradeService} from '@services/modules/grade/grade.service';

import { DesignReportCardHtmlAdapter } from './design-report-card.html.adapter';
import { DesignReportCardCanvasAdapter } from './design-report-card.canvas.adapter';

import { DEFAULT_BACKGROUND_COLOR } from './../../../class/constants_3';

@Component({
  selector: 'app-design-report-card',
  templateUrl: './design-report-card.component.html',
  styleUrls: ['./design-report-card.component.css'],
  providers: [
    ReportCardService,
    StudentService,
    ClassService,
    ExaminationService,
    SubjectService,
    SchoolService,
    AttendanceService,
    GradeService, 
    MatDialog
  ]
})
export class DesignReportCardComponent implements OnInit {
  user: any;
  canvas: any;

  currentLayout: {id?:any, parentSchool:string, name:string, content: any};
  ADD_LAYOUT_STRING = '<Add New Layout>';

  // stores the layour list from backend, new layout or modified layout is added to this list only after saving to backend
  reportCardLayoutList: any[] = [];
  fontFamilyList = FONT_FAMILY_LIST;

  unuploadedFiles: {string:string}[] = []; // Local urls of files to be uploaded, format [{file_uri : file_name},...]

  serviceAdapter: DesignReportCardServiceAdapter;
  htmlAdapter: DesignReportCardHtmlAdapter = new DesignReportCardHtmlAdapter();
  canvasAdapter: DesignReportCardCanvasAdapter;

  DATA: {
    studentId: number,
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
    }
  } = {
    studentId: null,
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
    }
  }

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
    this.DATA.data.school = this.user.activeSchool;
    
    this.serviceAdapter = new DesignReportCardServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();

    this.canvasAdapter = new DesignReportCardCanvasAdapter();
    this.canvasAdapter.initilizeAdapter(this);

    this.htmlAdapter.initializeAdapter(this);
    console.log(this.dialog);
    this.downloadFont();
  }
  
  getFontStyleList(fontFamilyDisplayName: any): any {
    return this.fontFamilyList.find(fontFamily => {
        return fontFamily.displayName === fontFamilyDisplayName;
    }).styleList;
  }

  downloadFont(): void {
    this.fontFamilyList.forEach(fontFamily => {
        const newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode(
            '@font-face {' +
            'font-family: ' + fontFamily.displayName + ';' +
            'src: url("'
                + 'https://korangleplus.s3.amazonaws.com/'
                + this.encodeURIComponent('assets/fonts/' +
                    fontFamily.displayName +
                    '/' + fontFamily.displayName + '-' + this.getFontStyleList(fontFamily.displayName)[0] + '.ttf')
            + '");' +
            '}'
        ));
        document.head.appendChild(newStyle);
    });
  }

  encodeURIComponent(url: any): any {
    return encodeURIComponent(url);
  }

  newLayout(): void { // populating current layout to empty vaues and current activeSchool ID
    this.currentLayout = {
        parentSchool: this.user.activeSchool.dbId,
        name: '',
        content: this.canvasAdapter.getEmptyLayout(),
    };
  } 

  populateCurrentLayoutWithGivenValue(value: any): void {
    // Check and give warning if the previous canvas is not saved
    if (this.canvas) {
      this.canvasAdapter.clearCanvas();
    }
    else {
      // if canvs is not already rendered subscribe to mutations while canvas is rendered
      let observer = new MutationObserver((mutations, me) => {  
        let canvas = document.getElementById('mainCanvas');
        if (canvas) {
          this.canvas = canvas;
          this.htmlAdapter.canvasSetUp();
          this.canvasAdapter.initilizeCanvas(this.canvas);
          this.canvasAdapter.loadData(this.currentLayout.content[0]);
          me.disconnect();
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });
    }

    if (value === this.ADD_LAYOUT_STRING) {
      this.newLayout();
    } else {
      this.currentLayout = { ...value, content: JSON.parse(value.content) };
    }
    if (this.canvas)
        this.canvasAdapter.loadData(this.currentLayout.content[0]);
  }

  doesCurrentLayoutHasUniqueName(): boolean {
    return this.currentLayout.name.trim() != '' && this.reportCardLayoutList.filter(reportCardLayout => {
      return this.currentLayout.id !== reportCardLayout.id
        && reportCardLayout.name === this.currentLayout.name;
    }).length === 0;
  };

  imageUploadHandler(event: any): void{
    const uploadedImage = event.target.files[0];
    const local_file_uri = URL.createObjectURL(uploadedImage);
    this.canvasAdapter.newImageLayer({ uri: local_file_uri }); // Push new Image layer with the provided data
    this.unuploadedFiles[local_file_uri] = uploadedImage.name;
  }

  resetCurrentLayout(): void {
    const layout = this.reportCardLayoutList.find(item => {
      return item.id === this.currentLayout.id;
    });
    this.populateCurrentLayoutWithGivenValue(layout === undefined ? this.ADD_LAYOUT_STRING : layout);
  }

  async saveLayout() {
    if (this.currentLayout.name.trim() == '') {
      await window.confirm("Layout Name Cannot Be Empty!");
      this.htmlAdapter.isSaving = false;
      return;
    }

    if (!this.currentLayout.id) // if new layout upload it
      await this.serviceAdapter.uploadCurrentLayout();
    const DataToSave = this.canvasAdapter.getDataToSave();
    const layers = DataToSave.layers;
    console.log('to be uploaded layers = ', layers);
    for (let i = 0; i < layers.length; i++){
      if (layers[i].LAYER_TYPE == 'IMAGE') {
        if (this.unuploadedFiles[layers[i].uri]) {
          let image = await fetch(layers[i].uri).then(response => response.blob());
          console.log(image)
          layers[i].uri = await this.serviceAdapter.uploadImageForCurrentLayout(image, this.unuploadedFiles[layers[i].uri]);
          console.log('image url = ', layers[i].image);
        }
      }
    }
    this.currentLayout.content = DataToSave;
    await this.serviceAdapter.uploadCurrentLayout();
    
    this.htmlAdapter.isSaving = false;
  }

  logMessage(msg: any): void{
    console.log("message: ", msg);
  }

}
