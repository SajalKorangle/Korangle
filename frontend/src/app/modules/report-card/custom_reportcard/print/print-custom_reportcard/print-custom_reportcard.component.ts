import { Component, OnInit, OnDestroy, AfterViewChecked, Input } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';
import { PrintService } from '../../../../../print/print-service';
import { DateInWordsPipe } from '../../../../../pipes/date-in-words.pipe';
import { AmountInWordsPipe } from '../../../../../pipes/amount-in-words.pipe';

@Component({
    templateUrl: './print-custom_reportcard.component.html',
    styleUrls: ['./print-custom_reportcard.component.css'],
    providers: [DateInWordsPipe,AmountInWordsPipe],
})
export class PrintCustomReportCardComponent implements OnInit, OnDestroy, AfterViewChecked {

    user: any;
    selectedStudentList:any = [];
    viewChecked = true;
    
    layout:any = null;
    layoutExamColumnList:any = [];
    layoutGradeList:any = [];
    layoutSubGradeList:any = [];
    studentRemarkList:any = [];

    studentSectionList:any = [];

    gradeList:any = [];
    subGradeList:any = [];
    studentSubGradeList:any = [];

    examinationList:any = [];
    selectedClass:any;
    selectedDivision:any;

    subjectList:any = [];

    classSubjectList:any = [];
    studentSubjectList:any = [];

    testSecondList:any = [];
    studentTestList:any = [];    

    studentAttendanceList:any = [];
    
    classTeacherSignatureList:any = [];

    sessionList:any[] = [];
    
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
    

    constructor(private cdRef: ChangeDetectorRef, 
                private printService: PrintService, 
                private dateInWords:DateInWordsPipe,
                private amountInWords:AmountInWordsPipe,) { }

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user;

        this.layout = value['layout'];
        this.layoutExamColumnList = value['layoutExamColumnList'];
        this.layoutGradeList = value['layoutGradeList'];
        this.layoutSubGradeList = value['layoutSubGradeList'];

        this.selectedStudentList = value['selectedStudentList'];
        this.studentSectionList = value['studentSectionList'];
        this.studentSubGradeList = value['studentSubGradeList'];
        this.studentTestList = value['studentTestList'];
        this.studentRemarkList = value['studentRemarkList'];
        this.studentAttendanceList = value['studentAttendanceList'];

        this.subjectList = value['subjectList'];
        this.classSubjectList = value['classSubjectList'];
        this.studentSubjectList = value['studentSubjectList'];

        this.sessionList = value['sessionList'];

        this.selectedClass = value['selectedClass'];
        this.selectedDivision = value['selectedDivision'];

        this.gradeList = value['gradeList'];
        this.subGradeList = value['subGradeList'];      

        this.examinationList = value['examinationList'];
        this.testSecondList = value['testSecondList'];

        this.classTeacherSignatureList = value['classTeacherSignatureList'];
        
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
    }
    
}
