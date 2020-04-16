import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';

import { ManageLayoutServiceAdapter } from './manage-layout.service.adapter';
import {DataStorage} from "../../../../../classes/data-storage";

import { ExaminationService} from '../../../../../services/modules/examination/examination.service';
import { CustomReportCardService } from '../../../../../services/modules/custom_reportcard/custom_reportcard.service';
import { GradeService } from '../../../../../services/modules/grade/grade.service';
import { ClassService } from '../../../../../services/modules/class/class.service';
import { SchoolService } from '../../../../../services/modules/school/school.service';
import { StudentService } from '../../../../../services/modules/student/student.service';
import {EXAM_COLUMN_TYPE, STUDENT_DETAILS_FOOTER, STUDENT_DETAILS_HEADER, STUDENT_DETAILS_FOOTER_KEYS, STUDENT_DETAILS_HEADER_KEYS} from '../../classes/constants';
import {LayoutHandler, StudentDataHandler, LayoutGradeHandler, LayoutSubGradeHandler, LayoutExamColumnHandler} from '../../classes/report-card-data';

@Component({
    selector: 'app-manage-layout',
    templateUrl: './manage-layout.component.html',
    styleUrls: ['./manage-layout.component.css'],
    providers: [ExaminationService, CustomReportCardService, GradeService, ClassService, SchoolService, StudentService],
})

export class ManageLayoutComponent implements OnInit {

    user;
    isLoading:Boolean;
    
    subjectsToShow = 5;

    EXAM_COLUMN_TYPE = EXAM_COLUMN_TYPE;
    STUDENT_DETAILS_FOOTER = STUDENT_DETAILS_FOOTER;
    STUDENT_DETAILS_HEADER = STUDENT_DETAILS_HEADER;
    STUDENT_DETAILS_FOOTER_KEYS = STUDENT_DETAILS_FOOTER_KEYS;
    STUDENT_DETAILS_HEADER_KEYS = STUDENT_DETAILS_HEADER_KEYS;

    layoutList:any = [];
    examinationList = [];
    gradeList = [];
    sessionList = [];    
    subGradeList = [];
    testSecondList = [];
    classList = [];
    divisionList = [];

    studentList = [];
    studentSectionList = [];
    studentSubGradeList = [];
    studentTestList = [];
    studentRemarksList = [];
    studentAttendanceList = [];

    currentLayout: any;
    layoutExamColumnList: any[] = [];
    layoutGradeList: any[] = [];
    layoutSubGradeList: any[] = [];
    
    serviceAdapter: ManageLayoutServiceAdapter;


    constructor(public examinationService:ExaminationService,
                public customReportCardService: CustomReportCardService,
                public gradeService: GradeService,
                public schoolService: SchoolService,
                public classService: ClassService,
                public studentService: StudentService,
                private cdRef: ChangeDetectorRef) {}
    
    detectChanges(){this.cdRef.detectChanges();}

    ngOnInit(): void {
        this.isLoading = true;
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ManageLayoutServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.currentLayout = this.getEmptyLayout();      
    }

    isLayoutNameUnique(): Boolean{
        return !this.layoutList.find(x => x.name===this.currentLayout.name);
    }

    resetCurrentLayout =() => {
        this.currentLayout = {...this.getEmptyLayout(), id: this.currentLayout.id};
        this.layoutSubGradeList = [];
        this.layoutExamColumnList = [];
        this.layoutGradeList = [];
        this.detectChanges();
    }

    getEmptyLayout = () => {
        return {
            name: '',
            reportCardHeading: '',
            parentSchool: this.user.activeSchool.dbId,
            parentSession: this.user.activeSchool.currentSessionDbId,
            showLetterHeadImage: false,

            attendanceStartDate: null,
            attendanceEndDate: null,
            decimalPlaces: 0,
            passingPercentage: 33,

            studentNameOrderNumber: 1,
            fatherNameOrderNumber: 2,
            motherNameOrderNumber: 3,
            rollNoOrderNumber: 0,
            scholarNoOrderNumber: 0,
            dateOfBirthOrderNumber: 4,
            dateOfBirthInWordsOrderNumber: 0,
            aadharNumberOrderNumber: 0,
            categoryOrderNumber: 0,
            familySSMIDOrderNumber: 0,
            childSSMIDOrderNumber: 0,
            classOrderNumber: 0,
            sectionOrderNumber: 0,
            casteOrderNumber: 0,
            classAndSectionOrderNumber: 0,
            addressOrderNumber: 0,

            overallMarksOrderNumber: 0,
            attendanceOrderNumber: 0,
            resultOrderNumber: 0,
            percentageOrderNumber: 0,
            promotedToClassOrderNumber: 0,
            
            remarksOrderNumber: 0,
        }
    }

    // Layout Header handlers
    getCurrentHeaderList = () => this.STUDENT_DETAILS_HEADER_KEYS.filter(key => this.currentLayout[key]!==0).sort((a,b) => this.currentLayout[a]-this.currentLayout[b]);
    getRemainingHeaderList = () => this.STUDENT_DETAILS_HEADER_KEYS.filter(key => this.currentLayout[key]===0);
    addHeaderKey = key => {this.currentLayout[key] = this.getCurrentHeaderList().length + 1; this.detectChanges()};
    removeHeaderKey = header_key => {
        STUDENT_DETAILS_HEADER_KEYS.filter(item => this.currentLayout[item]>this.currentLayout[header_key]).forEach(item => {
            this.currentLayout[item]--;
        })
        this.currentLayout[header_key] = 0;
        this.detectChanges();
    }
    dropHeaderHandler(event): void{
        const header_key = this.STUDENT_DETAILS_HEADER_KEYS.find(item => this.currentLayout[item]===event.previousIndex+1);
        this.STUDENT_DETAILS_HEADER_KEYS.filter(item => this.currentLayout[item]>event.previousIndex+1).forEach(item => {this.currentLayout[item]--});
        this.STUDENT_DETAILS_HEADER_KEYS.filter(item => this.currentLayout[item]>=event.currentIndex+1).forEach(item => {this.currentLayout[item]++});
        this.currentLayout[header_key]=event.currentIndex+1;
        this.detectChanges();
    }   
    
    // LayoutExamColumn handlers
    getRemainingExaminationList = () => this.examinationList.filter(x => !this.layoutExamColumnList.find(y => y.parentExamination===x.id));
    addLayoutExamColumn = (examination) => {
        this.layoutExamColumnList = [...this.layoutExamColumnList, {
            parentExamination: examination.id,
            orderNumber: this.layoutExamColumnList.length+1,
            name: examination.name,
            maximumMarksObtainedOne: 100,
            maximumMarksObtainedTwo: 100,
            columnType: 'Simple'
        }]
        this.detectChanges();
    }
    removeLayoutExamColumn = layoutExamColumn => {
        this.layoutExamColumnList = this.layoutExamColumnList.filter(item => item!==layoutExamColumn);
        this.layoutExamColumnList.forEach((item, i) => {item.orderNumber=i+1})
        this.detectChanges();
    }    
    dropExamHandler(event): void{
        moveItemInArray(this.layoutExamColumnList, event.previousIndex, event.currentIndex);
        this.layoutExamColumnList.forEach((item, i) => {item.orderNumber=i+1})
        this.detectChanges();
    }
    getExamination = id => this.examinationList.find(x => x.id===id);

    // LayoutGrade handlers
    getGrade = id => this.gradeList.find(x => x.id===id);
    getSubGrade = id => this.subGradeList.find(x => x.id===id);
    getRemainingGradeList = () => this.gradeList.filter(x => !this.layoutGradeList.find(y => y.parentGrade===x.id));
    addLayoutGrade = grade => {
        this.layoutGradeList = [...this.layoutGradeList, {
            parentGrade: grade.id,
            orderNumber: this.layoutGradeList.length+1,
        }]
        this.detectChanges();
    }
    dropGradeHandler(event): void{
        moveItemInArray(this.layoutGradeList, event.previousIndex, event.currentIndex);
        this.layoutGradeList.forEach((item, i) => {item.orderNumber=i+1})
        this.detectChanges();
    }

    // LayoutSubGrade handlers
    getLayoutSubGradeList = grade => this.layoutSubGradeList.filter(x => this.getSubGrade(x.parentSubGrade).parentGrade===grade.id);
    getRemainingSubGradeList = grade => this.subGradeList.filter(x => x.parentGrade===grade.id && !this.getLayoutSubGradeList(grade).find(y=>y.parentSubGrade===x.id));
    removeLayoutSubGrade = layoutSubGrade => {
        this.layoutSubGradeList = this.layoutSubGradeList.filter(x => x!==layoutSubGrade);
        this.layoutSubGradeList.filter(x => this.getSubGrade(x.parentSubGrade).parentGrade === this.getSubGrade(layoutSubGrade.parentSubGrade).parentGrade).forEach((item, i) => {item.orderNumber=i+1})
        this.detectChanges();
    }
    removeLayoutGrade = layoutGrade => {
        this.layoutSubGradeList = this.layoutSubGradeList.filter(item => !this.getLayoutSubGradeList(this.getGrade(layoutGrade.parentGrade)).includes(item));
        this.layoutGradeList = this.layoutGradeList.filter(x => x!==layoutGrade);
    }
    addLayoutSubGrade = (subGrade) => {
        this.layoutSubGradeList = [...this.layoutSubGradeList, {
            parentSubGrade: subGrade.id,
            orderNumber: this.getLayoutSubGradeList(this.getGrade(subGrade.parentGrade)).length,
        }]
        this.detectChanges();
    }

    // Layout footer handlers
    getCurrentFooterList = () => this.STUDENT_DETAILS_FOOTER_KEYS.filter(key => this.currentLayout[key]!==0).sort((a,b) => this.currentLayout[a]-this.currentLayout[b]);
    getRemainingFooterList = () => this.STUDENT_DETAILS_FOOTER_KEYS.filter(key => this.currentLayout[key]===0);
    addFooterKey = key => {this.currentLayout[key] = this.getCurrentFooterList().length + 1; this.detectChanges();};
    removeFooterKey = footer_key => {
        STUDENT_DETAILS_FOOTER_KEYS.filter(item => this.currentLayout[item]>this.currentLayout[footer_key]).forEach(item => {
            this.currentLayout[item]--;
        })
        this.currentLayout[footer_key] = 0;
        this.detectChanges();
    }
    dropFooterHandler(event): void{
        const footer_key = this.STUDENT_DETAILS_FOOTER_KEYS.find(item => this.currentLayout[item]===event.previousIndex+1);
        this.STUDENT_DETAILS_FOOTER_KEYS.filter(item => this.currentLayout[item]>event.previousIndex+1).forEach(item => {this.currentLayout[item]--});
        this.STUDENT_DETAILS_FOOTER_KEYS.filter(item => this.currentLayout[item]>=event.currentIndex+1).forEach(item => {this.currentLayout[item]++});
        this.currentLayout[footer_key]=event.currentIndex+1;
        this.detectChanges();
    }

    // Student Data handlers
    getStudentSubGradeList = () => this.layoutSubGradeList.map(layoutSubGrade => ({gradeObtained: '5', parentSubGrade: layoutSubGrade.parentSubGrade, parentStudent: this.studentList[0].id}))

    getStudentTestListForExamination = layoutExamColumn => {
        let ret = [];
        for(let i=1; i<=this.subjectsToShow; i++){
            if(layoutExamColumn.columnType==='Simple'){
                ret.push({parentExamination: layoutExamColumn.parentExamination, parentSubject: i, parentStudent: this.studentList[0].id, testType: null, marksObtained: 50})
            }else{
                layoutExamColumn.columnType.split('/').forEach(type => {
                    ret.push({parentExamination: layoutExamColumn.parentExamination, parentSubject: i, parentStudent: this.studentList[0].id, testType: type, marksObtained: 50})
                })
            }            
        }
        return ret;      
    }
    getStudentTestList = () => this.layoutExamColumnList.reduce((acc, b) => acc.concat(this.getStudentTestListForExamination(b)), []);
    getTestListForExamination = layoutExamColumn => {
        let ret = [];
        for(let i=1; i<=this.subjectsToShow; i++){
            if(layoutExamColumn.columnType==='Simple'){
                ret.push({parentExamination: layoutExamColumn.parentExamination, parentSubject: i, parentClass: this.studentSectionList[0].parentClass, parentDivision: this.studentSectionList[0].parentDivision, startTime: null, endTime: null,testType: null, maximumMarks: 50})
            }else{
                layoutExamColumn.columnType.split('/').forEach(type => {
                    ret.push({parentExamination: layoutExamColumn.parentExamination, parentSubject: i, parentClass: this.studentSectionList[0].parentClass, parentDivision: this.studentSectionList[0].parentDivision, startTime: null, endTime: null,testType: type, maximumMarks: 50})
                })
            }            
        }
        return ret;      
    }
    getTestList = () => this.layoutExamColumnList.reduce((acc, b) => acc.concat(this.getTestListForExamination(b)), []);
    getSubjectList = () => Object.keys(Array(this.subjectsToShow).fill(0)).map((item, i) => ({name: `Subject ${i+1}`, id: i+1}));
    getClassSubjectList = () => this.getSubjectList().map(subject => ({parentSubject: subject.id, parentClass: this.studentSectionList[0].parentClass, parentDivision: this.studentSectionList[0].parentDivision, mainSubject: true, orderNumber: 0}))
    getStudentSubjectList = () => this.getSubjectList().map(subject => ({parentSubject: subject.id, parentStudent: this.studentList[0].id, parentSession: this.studentSectionList[0].parentSession}))
    getStudentRemarksList = () => [{parentStudent: this.studentList[0].id, parentSession: this.user.activeSchool.currentSessionDbId, remark: 'Some remark here'}]
    getClassTeacherSignatureList = () => []
    getStudentAttendanceList =() => [] 

    initializeLayout = layout => {
        this.currentLayout = layout;
        this.serviceAdapter.fetchLayoutData();
    }
}
