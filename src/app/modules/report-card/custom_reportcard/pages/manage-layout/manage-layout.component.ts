import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';

import { ManageLayoutServiceAdapter } from './manage-layout.service.adapter';
import {DataStorage} from "../../../../../classes/data-storage";

import { ExaminationService} from '../../../../../services/modules/examination/examination.service';
import { CustomReportCardService } from '../../../../../services/modules/custom_reportcard/custom_reportcard.service';
import { GradeService } from '../../../../../services/modules/grade/grade.service';



// ? What if no exams have been created, can layout be created -> Exams are must before creating a layout
// ? About orderNumber of studentDetailsHeader
// TODO: Handle change in orderNumber of exams mapping
// TODO: Layout name to be unique
// TODO: Examination names for mapped examination must be unique
// TODO: Update the LayoutList after creating or updating the layout
// TODO: Handle initialization of data properly
// TODO: Handle class&section, decimal, address layout parameters
// TODO: Handle updating of sub grades

class StudentDetailsHeaderHandle{
    parameter:any;
    show:Boolean;
    key:String; // Used for storing the backend column name
    orderNumber:Number; // Used for initial ordering of array for existing layouts
                                // Because new layout has fixed pre-decided order 
    constructor(parameter, show, key, orderNumber){
        this.parameter = parameter;
        this.show = show;
        this.key = key;
        this.orderNumber = orderNumber;
    }
}

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

// class LayoutHandle{
//     id:Number;
//     name:String;
//     reportCardHeading:String;
// }

class LayoutParameter{
    id:Number;
    name:String;
    reportCardHeading:String;
    studentDetailsHeader:any;
    layoutExamColumnList:any;

}


@Component({
    selector: 'app-manage-layout',
    templateUrl: './manage-layout.component.html',
    styleUrls: ['./manage-layout.component.css'],
    providers: [ExaminationService, CustomReportCardService, GradeService],
})

export class ManageLayoutComponent implements OnInit {

    user;
    isLoading:Boolean;
    layoutList:any = [];
    selectedLayout:LayoutParameter;

    examinationList = [];
    layoutExamColumnList = [];
    currentLayout_LayoutExamColumnList:LayoutExamColumnHandle[] = [];
    subjectCountArray:Number[]; // Used in preview to show the no of rows in exam table


    // Grades
    gradeList = [];
    layoutGradeList = [];

    // This variable will have all the mapped LayoutGrades for current layout
    // Both: already created and newly created
    currentLayout_LayoutGradeList:LayoutGradeHandle[]=[];
    
    // SubGrades
    subGradeList = [];
    layoutSubGradeList = [];
    currentLayout_LayoutSubGradeList:LayoutSubGradeHandle[]=[];

    EXAM_COLUMN_TYPE = [
        'Simple', // Default selected
        'Oral/Written',
        'Practical/Theory',
    ];
    

    serviceAdapter: ManageLayoutServiceAdapter;


    constructor(public examinationService:ExaminationService,
                private cdRef: ChangeDetectorRef,
                public customReportCardService: CustomReportCardService,
                public gradeService: GradeService) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.user = DataStorage.getInstance().getUser();
        console.log(this.user);
        this.serviceAdapter = new ManageLayoutServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        this.selectedLayout = null;
    }

    resetCurrentLayout(){
        this.selectedLayout = null;
        this.currentLayout_LayoutExamColumnList = [];
        this.currentLayout_LayoutGradeList = [];
        this.currentLayout_LayoutSubGradeList = [];
    }    

    initializeNewLayout(){
        let new_layout = new LayoutParameter();
        new_layout.id = 0;
        new_layout.name = '';
        new_layout.reportCardHeading = '';

        // Creating studentDetailsHeader
        let temp = [];
        temp.push(new StudentDetailsHeaderHandle('Name',true, 'showStudentName',0));
        temp.push(new StudentDetailsHeaderHandle('Father\'s Name',true, 'showFatherName',0));
        temp.push(new StudentDetailsHeaderHandle('Roll No.',true,'showRollNo',0));
        temp.push(new StudentDetailsHeaderHandle('Class',true,'showClass',0));
        temp.push(new StudentDetailsHeaderHandle('Mother\'s Name',false,'showMotherName',0));
        temp.push(new StudentDetailsHeaderHandle('Scholar No.',false,'showScholarNo',0));
        temp.push(new StudentDetailsHeaderHandle('Aadhar No.',false, 'showAadharNo',0));
        temp.push(new StudentDetailsHeaderHandle('Date of birth',false, 'showDateOfBirth',0));
        temp.push(new StudentDetailsHeaderHandle('Date of birth(in words)',false, 'showDateOfBirthInWords',0));
        temp.push(new StudentDetailsHeaderHandle('Category',false, 'showCategory',0));
        temp.push(new StudentDetailsHeaderHandle('Child SSMID',false, 'showChildSSMID',0));
        temp.push(new StudentDetailsHeaderHandle('Family SSMID',false, 'showFamilySSMID',0));
        temp.push(new StudentDetailsHeaderHandle('Section',false, 'showSection',0));
        temp.push(new StudentDetailsHeaderHandle('Caste',false, 'showCaste',0));
        // temp.push(new StudentDetailsHeaderHandle('Address',false, 'show'));
        // temp.push(new StudentDetailsHeaderHandle('Class & Section',false));
        new_layout.studentDetailsHeader = temp;

        // Creating LayoutExamColumnHandle
        new_layout.layoutExamColumnList = [];
        this.currentLayout_LayoutExamColumnList = [];
        this.updateSubjectCountArray(6);


        this.currentLayout_LayoutGradeList = [];
        this.currentLayout_LayoutSubGradeList = [];

        this.selectedLayout = new_layout;
        console.log(this.selectedLayout);
    }

    initializeExistingLayout(layout){
        console.log(layout);
        if(layout.id == 0) return;
        let new_layout = new LayoutParameter();
        new_layout.id = layout.id;
        new_layout.name = layout.name;
        new_layout.reportCardHeading = layout.reportCardHeading;
        this.updateSubjectCountArray(6);

        // Creating studentDetailsHeader
        let temp = [];
        temp.push(new StudentDetailsHeaderHandle('Name',(layout.showStudentName!=0?true:false), 'showStudentName',layout.showStudentName));
        temp.push(new StudentDetailsHeaderHandle('Father\'s Name',(layout.showFatherName!=0?true:false), 'showFatherName',layout.showFatherName));
        temp.push(new StudentDetailsHeaderHandle('Roll No.',(layout.showRollNo!=0?true:false),'showRollNo',layout.showRollNo));
        temp.push(new StudentDetailsHeaderHandle('Class',(layout.showClass!=0?true:false),'showClass', layout.showClass));
        temp.push(new StudentDetailsHeaderHandle('Mother\'s Name',(layout.showMotherName!=0?true:false),'showMotherName',layout.showMotherName));
        temp.push(new StudentDetailsHeaderHandle('Scholar No.',(layout.showScholarNo!=0?true:false),'showScholarNo',layout.showScholarNo));
        temp.push(new StudentDetailsHeaderHandle('Aadhar No.',(layout.showAadharNo!=0?true:false), 'showAadharNo', layout.showAadharNo));
        temp.push(new StudentDetailsHeaderHandle('Date of birth',(layout.showDateOfBirth!=0?true:false), 'showDateOfBirth', layout.showDateOfBirth));
        temp.push(new StudentDetailsHeaderHandle('Date of birth(in words)',(layout.showDateOfBirthInWords!=0?true:false), 'showDateOfBirthInWords', layout.showDateOfBirthInWords));
        temp.push(new StudentDetailsHeaderHandle('Category',(layout.showCategory!=0?true:false), 'showCategory', layout.showCategory));
        temp.push(new StudentDetailsHeaderHandle('Child SSMID',(layout.showChildSSMID!=0?true:false), 'showChildSSMID', layout.showChildSSMID));
        temp.push(new StudentDetailsHeaderHandle('Family SSMID',(layout.showFamilySSMID!=0?true:false), 'showFamilySSMID', layout.showFamilySSMID));
        temp.push(new StudentDetailsHeaderHandle('Section',(layout.showSection!=0?true:false), 'showSection', layout.showSection));
        temp.push(new StudentDetailsHeaderHandle('Caste',(layout.showCaste!=0?true:false), 'showCaste', layout.showCaste));
        // temp.push(new StudentDetailsHeaderHandle('Address',false, 'show'));
        // temp.push(new StudentDetailsHeaderHandle('Class & Section',false));

        // sorting the list according to orderNumber
        temp = temp.sort(function(a,b){
            if(a.orderNumber == b.orderNumber){
                // Two are zero
                return -1;
            }
            if(a.orderNumber != 0){
                if(b.orderNumber == 0) return -1;
            }
            if(b.orderNumber != 0){
                if(a.orderNumber == 0) return 1;
            }
            return a.orderNumber - b.orderNumber;
        });
        new_layout.studentDetailsHeader = temp;

        // LayoutExamColumnHandle
        temp = [];
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
        this.currentLayout_LayoutExamColumnList = temp;

        // Grades and sub grades
        this.currentLayout_LayoutGradeList = this.layoutGradeList.filter(item=>{
            return item.parentLayout == new_layout.id;
        })

        this.currentLayout_LayoutSubGradeList =  this.layoutSubGradeList.filter(item=>{
            return this.currentLayout_LayoutGradeList.find(layoutGrade=>{
                return layoutGrade.id == item.parentLayoutGrade;
            }) != undefined;
        })

        console.log(new_layout);
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
        return this.selectedLayout.studentDetailsHeader.filter(item=>{
            if(item.show){
                return true;
            }
            return false;
        });
    }

    // Return the examinations which are not mapped or not present in selectedLayout.layoutExamColumnList
    // selectedLayout should not be null before calling this function
    getFilteredExaminationList(){
        if(this.selectedLayout == null || this.selectedLayout == undefined) return [];

        return this.examinationList.filter(examination=>{
            if(this.currentLayout_LayoutExamColumnList.find(layoutExam=>{
                return layoutExam.parentExamination == examination.id;
            }) == undefined) return true;
            return false;
        });

        // return this.examinationList.filter(exam =>{
        //     if(this.selectedLayout.layoutExamColumnList.find(item=>{
        //         if(item.parentExamination == exam.id) return true;
        //         return false;
        //     }) == undefined) return true;
        //     return false;
        // });

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
        this.currentLayout_LayoutExamColumnList.push(new_layout_exam_column_handle);
        // this.selectedLayout.layoutExamColumnList.push(new_layout_exam_column_handle);
    }

    // Used for no of rows in examination table preview
    // cnt is of type string
    updateSubjectCountArray(cnt){
        this.subjectCountArray = new Array(parseInt(cnt));
    }

    // Check if name already exist
    isNameUnqiue(selected,list){
        return list.find(item => {
            if(item.name == selected.name && item.id != selected.id) return true;
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
            if(this.currentLayout_LayoutGradeList.find(layoutGrade=>{
                return layoutGrade.parentGrade == item.id;
            }) == undefined) return true;
            return false;
        });
    }

    addGradeMapping(grade){
        let new_grade = new LayoutGradeHandle();
        new_grade.id = 0;
        new_grade.parentLayout=this.selectedLayout.id;
        new_grade.parentGrade = grade.id;
        new_grade.orderNumber = 0;
        this.currentLayout_LayoutGradeList.push(new_grade);
    }

    // Returns the list of sub grades mapped for that grade in layout
    // Grades mapped for selected layout will be in currentLayout_LayoutGradeList
    // For newly created layoutGrades, compare the them by Grade id 
    getFilteredLayoutSubGradeList(layoutGrade){
        return this.currentLayout_LayoutSubGradeList.filter(item=>{
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
            return this.currentLayout_LayoutSubGradeList.find(item=>{
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

        this.currentLayout_LayoutSubGradeList.push(new_subgrade);
    }

    getSubGradeName(subGrade_id){
        let temp = this.subGradeList.find(item=>{
            return item.id == subGrade_id;
        });
        if(temp == undefined) return '';
        return temp.name;
    }
}
