import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';

import { ManageLayoutServiceAdapter } from './manage-layout.service.adapter';
import {DataStorage} from "../../../../../classes/data-storage";

import { ExaminationService} from '../../../../../services/modules/examination/examination.service';
import { CustomReportCardService } from '../../../../../services/modules/custom_reportcard/custom_reportcard.service';
import { GradeService } from '../../../../../services/modules/grade/grade.service';
import { ClassService } from '../../../../../services/modules/class/class.service';


class LayoutExamColumnHandle{
    id:Number = 0;
    parentLayout:Number = 0;
    parentExamination:Number = 0;
    orderNumber:Number = 0;
    name:String; 
    maximumMarksObtainedOne:Number = 100;
    maximumMarksObtainedTwo:Number = 100;
    columnType:any;
}

class LayoutGradeHandle{
    id:Number = 0;
    parentLayout:Number = 0;
    parentGrade:Number = 0;
    orderNumber:Number = 0;
}

class LayoutSubGradeHandle{
    id:Number = 0;
    parentLayoutGrade:Number = 0;
    parentSubGrade:Number = 0;
    orderNumber:Number = 0;
}

class LayoutHandle{
    id:Number = 0;
    name:String = '';
    reportCardHeading:String = '';
    parentSchool:Number = 0;
    parentSession:Number = 0;
    showLetterHeadImage:Boolean = false;

    attendanceStartDate: Date = null;
    attendanceEndDate: Date = null;
    decimalPlaces: Number = 0;

    studentNameOrderNumber: Number = 0;
    fatherNameOrderNumber: Number = 0;
    motherNameOrderNumber: Number = 0;
    rollNoOrderNumber: Number = 0;
    scholarNoOrderNumber: Number = 0;
    dateOfBirthOrderNumber: Number = 0;
    dateOfBirthInWordsOrderNumber: Number = 0;
    aadharNumberOrderNumber: Number = 0;
    categoryOrderNumber: Number = 0;
    familySSMIDOrderNumber: Number = 0;
    childSSMIDOrderNumber: Number = 0;
    classOrderNumber: Number = 0;
    sectionOrderNumber: Number = 0;
    casteOrderNumber: Number = 0;
    classAndSectionOrderNumber: Number = 0;
    addressOrderNumber: Number = 0;

    overallMarksOrderNumber: Number = 0;
    attendanceOrderNumber: Number = 0;
    resultOrderNumber: Number = 0;
    percentageOrderNumber: Number = 0;
    promotedToClassOrderNumber: Number = 0;
    
    remarksOrderNumber: Number = 0;
}


class LayoutParameter{
    layout:LayoutHandle = new LayoutHandle();
    layoutExamColumnList:LayoutExamColumnHandle[] = [];
    layoutGradeList:LayoutGradeHandle[] = [];
    layoutSubGradeList:LayoutSubGradeHandle[] = [];

    // Stores the layouthandle parameters which are selected;
    selectedStudentDetailsHeader:any = [];
    selectedStudentDetailsFooter:any = [];
    autoAttendance:Boolean = false;
}


@Component({
    selector: 'app-manage-layout',
    templateUrl: './manage-layout.component.html',
    styleUrls: ['./manage-layout.component.css'],
    providers: [ExaminationService, CustomReportCardService, GradeService, ClassService],
})

export class ManageLayoutComponent implements OnInit {

    user;
    isLoading:Boolean;
    layoutList:any = [];
    selectedLayout:LayoutParameter;

    examinationList = [];
    layoutExamColumnList = [];
    subjectCountArray:Number[]; // Used in preview to show the no of rows in exam table

    // Grades
    gradeList = [];
    layoutGradeList = [];

    
    // SubGrades
    subGradeList = [];
    layoutSubGradeList = [];

    EXAM_COLUMN_TYPE = [
        'Simple', // Default selected
        'Oral/Written',
        'Practical/Theory',
    ];

    
    STUDENT_DETAILS_HEADER = {
        'studentNameOrderNumber':'Student Name',
        'fatherNameOrderNumber':'Father\'s Name',
        'motherNameOrderNumber': 'Mother\'s Name',
        'classOrderNumber':'Class',
        'rollNoOrderNumber': 'Roll No.',
        'scholarNoOrderNumber': 'Scholar No.',
        'dateOfBirthOrderNumber': 'Date of birth',
        'dateOfBirthInWordsOrderNumber': 'Date of birth( in words )',
        'aadharNumberOrderNumber': 'Aadhar No',
        'categoryOrderNumber': 'Category',
        'familySSMIDOrderNumber': 'Family SSMID',
        'childSSMIDOrderNumber': 'Child SSMID',
        'sectionOrderNumber': 'Section',
        'casteOrderNumber':'Caste',
        'addressOrderNumber':'Address',
        'classAndSectionOrderNumber':'Class and Section'
    };
    
    STUDENT_DETAILS_FOOTER = {
        'attendanceOrderNumber':'Attendance',
        'overallMarksOrderNumber':'Overall marks',
        'resultOrderNumber':'Result',
        'percentageOrderNumber':'Percentage',
        'promotedToClassOrderNumber':'Promoted to class',

    };
    
    
    STUDENT_DETAILS_HEADER_KEYS = Object.keys(this.STUDENT_DETAILS_HEADER);
    STUDENT_DETAILS_FOOTER_KEYS = Object.keys(this.STUDENT_DETAILS_FOOTER);

    serviceAdapter: ManageLayoutServiceAdapter;


    constructor(public examinationService:ExaminationService,
                private cdRef: ChangeDetectorRef,
                public customReportCardService: CustomReportCardService,
                public gradeService: GradeService,
                public classService: ClassService) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.user = DataStorage.getInstance().getUser();
        console.log(this.user);
        this.serviceAdapter = new ManageLayoutServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.initializeNewLayout();
    }

    resetCurrentLayout(){
        this.selectedLayout = null;
        this.initializeNewLayout();
    }    

    initializeNewLayout(){
        let new_layout = new LayoutParameter();
        new_layout.layout.id = 0;
        new_layout.layout.name = '';
        new_layout.layout.parentSchool = this.user.activeSchool.dbId;
        new_layout.layout.parentSession = this.user.activeSchool.currentSessionDbId;
        new_layout.layout.reportCardHeading = '';

        // Push below in the required order
        new_layout.selectedStudentDetailsHeader.push('studentNameOrderNumber');
        new_layout.selectedStudentDetailsHeader.push('fatherNameOrderNumber');
        new_layout.selectedStudentDetailsHeader.push('rollNoOrderNumber');
        new_layout.selectedStudentDetailsHeader.push('classOrderNumber');

        // Creating LayoutExamColumnHandle
        new_layout.layoutExamColumnList = [];
        this.updateSubjectCountArray(6);


        new_layout.layoutGradeList = [];
        new_layout.layoutSubGradeList = [];

        new_layout.selectedStudentDetailsFooter = [];
        this.selectedLayout = new_layout;
    }


    initializeExistingLayout(layout){

        if(layout == null || layout == '') return;
        let new_layout = new LayoutParameter();
        
        new_layout.layout = layout;
        new_layout.layout.parentSchool = this.user.activeSchool.dbId;
        new_layout.layout.parentSession = this.user.activeSchool.currentSessionDbId;
        
        if(new_layout.layout.attendanceStartDate != null && new_layout.layout.attendanceEndDate != null){
            new_layout.autoAttendance = true;
        }

        let studentHeaderKey_temp = [];
        
        this.STUDENT_DETAILS_HEADER_KEYS.forEach(key=>{
            if(layout[key] != 0) studentHeaderKey_temp.push(key);
        })
        studentHeaderKey_temp.sort();
        new_layout.selectedStudentDetailsHeader = studentHeaderKey_temp;

        let studentFooterKey_temp = [];

        this.STUDENT_DETAILS_FOOTER_KEYS.forEach(key=>{
            if(layout[key] != 0) studentFooterKey_temp.push(key);
        })
        studentFooterKey_temp.sort();
        new_layout.selectedStudentDetailsFooter = studentFooterKey_temp;

        this.updateSubjectCountArray(6);

        // LayoutExamColumnHandle
        let temp = [];
        this.layoutExamColumnList.filter(item=>{
            if(item.parentLayout == layout.id) return true;
            return false;
        }).sort((a,b)=>{
            return a.orderNumber-b.orderNumber;
        }).map(item=>{
            let temp_exam_handle = new LayoutExamColumnHandle();
            temp_exam_handle.parentLayout = layout.id;
            temp_exam_handle.parentExamination = item.parentExamination;
            temp_exam_handle.id = item.id;
            temp_exam_handle.orderNumber = item.orderNumber;
            temp_exam_handle.name = item.name;
            temp_exam_handle.maximumMarksObtainedOne = item.maximumMarksObtainedOne;
            temp_exam_handle.maximumMarksObtainedTwo = item.maximumMarksObtainedTwo;
            temp_exam_handle.columnType = item.columnType;
            temp.push(temp_exam_handle);
        });

        new_layout.layoutExamColumnList = temp;

        // Grades and sub grades
        new_layout.layoutGradeList = this.layoutGradeList.filter(item=>{
            return item.parentLayout == new_layout.layout.id;
        })

        new_layout.layoutSubGradeList =  this.layoutSubGradeList.filter(item=>{
            return new_layout.layoutGradeList.find(layoutGrade=>{
                return layoutGrade.id == item.parentLayoutGrade;
            }) != undefined;
        })

        this.selectedLayout = new_layout;
    }

    // Todo: function is updated
    getSessionName(sessionId: any): any {
        let result = '';
        switch(sessionId) {
            case 1:
                result = 'Session 2017-18';
                break;
            case 2:
                result = 'Session 2018-19';
                break;
            case 3:
                result = 'Session 2019-20';
                break;
        }
        return result;
    }

    // Returns the studentDetailHeader which are set to true
    getFilteredStudentDetailHeader(){
        
        let temp = [];
        this.STUDENT_DETAILS_HEADER_KEYS.forEach(item =>{
            let isFound = false;
            this.selectedLayout.selectedStudentDetailsHeader.forEach(key=>{
                if(key == item){
                    isFound = true;
                }
            })
            if(isFound == false) temp.push(item);
        });
        return temp;
    }

    addStudentHeader(studentHeaderKey){
        if(this.selectedLayout == null || this.selectedLayout == undefined) return;
        this.selectedLayout.selectedStudentDetailsHeader.push(studentHeaderKey);
    }

    removeSelectedStudentHeader(studentDetailKey){
        this.selectedLayout.selectedStudentDetailsHeader = this.selectedLayout.selectedStudentDetailsHeader.filter(item=>{
            if(item == studentDetailKey) return false;
            return true;
        })
    }

    // Returns the studentDetailFooter which are set to true
    getFilteredStudentDetailFooter(){
        
        let temp = [];
        this.STUDENT_DETAILS_FOOTER_KEYS.forEach(item =>{
            let isFound = false;
            this.selectedLayout.selectedStudentDetailsFooter.forEach(key=>{
                if(key == item){
                    isFound = true;
                }
            })
            if(isFound == false) temp.push(item);
        });
        return temp;
    }

    addStudentFooter(studentFooterKey){
        if(this.selectedLayout == null || this.selectedLayout == undefined) return;
        this.selectedLayout.selectedStudentDetailsFooter.push(studentFooterKey);
    }

    removeSelectedStudentFooter(studentDetailKey){
        this.selectedLayout.selectedStudentDetailsFooter = this.selectedLayout.selectedStudentDetailsFooter.filter(item=>{
            if(item == studentDetailKey) return false;
            return true;
        })
    }

    // Return the examinations which are not mapped or not present in selectedLayout.layoutExamColumnList
    // selectedLayout should not be null before calling this function
    getFilteredExaminationList(){
        if(this.selectedLayout == null || this.selectedLayout == undefined) return [];

        return this.examinationList.filter(exam =>{
            if(this.selectedLayout.layoutExamColumnList.find(item=>{
                if(item.parentExamination == exam.id) return true;
                return false;
            }) == undefined) return true;
            return false;
        });

    }

    // Displays exam name by the examination id from examinationList
    getExaminationName(exam_id){
        let examination = this.examinationList.find(item => {
            if(item.id == exam_id) return true;
            return false;
        });
        if(examination == undefined) return '';
        return examination.name;
    }

    // Adds the exam to the selectedLayout
    addExamToMapping(examination){
        if(this.selectedLayout == null || this.selectedLayout == undefined) return;
        let new_layout_exam_column_handle = new LayoutExamColumnHandle();
        new_layout_exam_column_handle.parentExamination = examination.id;
        new_layout_exam_column_handle.name = examination.name;
        new_layout_exam_column_handle.columnType = this.EXAM_COLUMN_TYPE[0];
        this.selectedLayout.layoutExamColumnList.push(new_layout_exam_column_handle);
    }

    removeLayoutExamColumnList(layoutExam){
        if(this.selectedLayout == null || this.selectedLayout == undefined) return;
        this.selectedLayout.layoutExamColumnList = this.selectedLayout.layoutExamColumnList.filter(item=>{
            if(item.id == layoutExam.id && item.parentLayout == layoutExam.parentLayout && item.parentExamination == layoutExam.parentExamination)
                return false;
            return true;
        });
    }

    // Used for no of rows in examination table preview
    // cnt is of type string
    updateSubjectCountArray(cnt){
        this.subjectCountArray = new Array(parseInt(cnt));
    }

    getTotalColummnsInExamTable():Number{
        if(this.selectedLayout == null) return 0;
        let total = 0;
        this.selectedLayout.layoutExamColumnList.forEach(layoutExamColumn=>{
            let len = layoutExamColumn.columnType.split('/').length;
            total += len;
            if(len > 1) total += 1;
        });
        if(this.selectedLayout.layoutExamColumnList.length > 1) total += 1;
        return total + 1;
    }
    // Check if name already exist
    isNameUnqiue(selectedLayout,list){
        return list.find(item => {
            if(item.name == selectedLayout.layout.name && item.id != selectedLayout.layout.id) return true;
            return false;
        }) == undefined;
    }

    // Drap and drop position
    drop(event: CdkDragDrop<string[]>, objectList) {
        moveItemInArray(objectList, event.previousIndex, event.currentIndex);
    }



    // Grades and subgrades
    getGradeName(grade_id){
        let grade = this.gradeList.find(item=>{
            if(item.id == grade_id) return true;
            return false;
        });
        if(grade == undefined) return '';
        return grade.name;
    }

    // Returns list of Grades not present in currentLayout_LayoutGradeList
    getFilteredGradeList(){
        return this.gradeList.filter(item=>{
            if(this.selectedLayout.layoutGradeList.find(layoutGrade=>{
                return layoutGrade.parentGrade == item.id;
            }) == undefined) return true;
            return false;
        });
    }

    addGradeMapping(grade){
        let new_grade = new LayoutGradeHandle();
        new_grade.id = 0;
        new_grade.parentLayout=this.selectedLayout.layout.id;
        new_grade.parentGrade = grade.id;
        new_grade.orderNumber = 0;
        this.selectedLayout.layoutGradeList.push(new_grade);
    }

    // Returns the list of sub grades mapped for that grade in layout
    // Grades mapped for selected layout will be in currentLayout_LayoutGradeList
    // For newly created layoutGrades, compare the them by Grade id 
    getFilteredLayoutSubGradeList(layoutGrade){
        return this.selectedLayout.layoutSubGradeList.filter(item=>{
            if(layoutGrade.id == 0){
                // newly created grade mapping
                let subGrade_id = item.parentSubGrade;
                let grade_id = this.subGradeList.find(subGrade=>{return subGrade.id == subGrade_id}).parentGrade;
                if(layoutGrade.parentGrade == grade_id) return true;
                return false;
            }
            return item.parentLayoutGrade == layoutGrade.id;
        });
    }

    // Returns list of all the sub grades in the grade that are not mapped
    getFilteredSubGradeList(layoutGrade){
        return this.subGradeList.filter(subGrade=>{
            return subGrade.parentGrade == layoutGrade.parentGrade;
        }).filter(subGrade=>{
            return this.selectedLayout.layoutSubGradeList.find(item=>{
                return item.parentSubGrade == subGrade.id;
            }) == undefined;
        });
    }

    // Mapps the SubGrade with the Grade
    addSubGradeMapping(subGrade, layoutGrade){
        let new_subgrade = new LayoutSubGradeHandle();
        new_subgrade.id = 0;
        new_subgrade.parentLayoutGrade = layoutGrade.id;
        new_subgrade.parentSubGrade = subGrade.id;
        new_subgrade.orderNumber = 0;

        this.selectedLayout.layoutSubGradeList.push(new_subgrade);
    }

    removeSubGradeMapping(subGrade){
        this.selectedLayout.layoutSubGradeList = this.selectedLayout.layoutSubGradeList.filter(layoutSubGrade=>{
            if(layoutSubGrade.id == subGrade.id && layoutSubGrade.parentLayoutGrade == subGrade.parentLayoutGrade
                && layoutSubGrade.parentSubGrade == subGrade.parentSubGrade) return false;
            return true;
        });
    }

    getSubGradeName(subGrade_id){
        let temp = this.subGradeList.find(item=>{
            return item.id == subGrade_id;
        });
        if(temp == undefined) return '';
        return temp.name;
    }


}
