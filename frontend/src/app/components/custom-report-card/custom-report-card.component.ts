import {Component, Input, OnInit } from '@angular/core';
import {EXAM_COLUMN_TYPE, STUDENT_DETAILS_FOOTER, STUDENT_DETAILS_FOOTER_KEYS, STUDENT_DETAILS_HEADER, STUDENT_DETAILS_HEADER_KEYS} from './../../modules/report-card/custom_reportcard/classes/constants';
import { DateInWordsPipe } from '../../pipes/date-in-words.pipe';
import { AmountInWordsPipe } from '../../pipes/amount-in-words.pipe';

@Component({
    selector: 'custom-report-card',
    templateUrl: './custom-report-card.component.html',
    styleUrls: ['./custom-report-card.component.css'],
    providers: [DateInWordsPipe, AmountInWordsPipe],
})
export class CustomReportCardComponent implements OnInit {

    @Input() user;

    // Layout data
    @Input() layout;
    @Input() layoutExamColumnList;
    @Input() layoutGradeList;
    @Input() layoutSubGradeList;

    // Student data
    @Input() studentList;
    @Input() studentSectionList;
    @Input() studentSubGradeList;
    @Input() studentTestList;
    @Input() studentRemarksList;
    @Input() studentAttendanceList;
    
    // Data List
    @Input() subjectList;
    @Input() sessionList;
    @Input() classList;
    @Input() divisionList;
    @Input() gradeList;
    @Input() subGradeList;
    @Input() examinationList;
    @Input() testList;

    STUDENT_DETAILS_FOOTER = STUDENT_DETAILS_FOOTER;
    STUDENT_DETAILS_FOOTER_KEYS = STUDENT_DETAILS_FOOTER_KEYS;
    STUDENT_DETAILS_HEADER = STUDENT_DETAILS_HEADER;
    STUDENT_DETAILS_HEADER_KEYS = STUDENT_DETAILS_HEADER_KEYS;


    constructor(private dateInWords:DateInWordsPipe,
        private amountInWords:AmountInWordsPipe) {}

    ngOnInit(): void {
        console.log(this.subjectList);
    }

    round = (number) => Math.round(number*Math.pow(10, this.layout.decimalPlaces))/Math.pow(10, this.layout.decimalPlaces)

    getParameterValue(key, student){
        let result:any = '';
        switch(key){
            case 'studentNameOrderNumber':
                return student.name;
            case 'fatherNameOrderNumber':
                return student.fathersName;
            case 'motherNameOrderNumber':
                return student.motherName;
            case 'classOrderNumber':
                return this.getClass(this.getStudentSection(student).parentClass).name;
            case 'rollNoOrderNumber':
                return this.getStudentSection(student).rollNumber
            case 'scholarNoOrderNumber':
                return student.scholarNumber;
            case 'dateOfBirthOrderNumber':
                return student.dateOfBirth;
            case 'dateOfBirthInWordsOrderNumber':
                return this.dateInWords.transform(student.dateOfBirth);
            case 'aadharNumberOrderNumber':
                return student.aadharNum;
            case 'categoryOrderNumber':
                return student.newCategoryField;
            case 'familySSMIDOrderNumber':
                return student.familySSMID;
            case 'childSSMIDOrderNumber': 
                return student.childSSMID;
            case 'sectionOrderNumber': 
                return this.getDivision(this.getStudentSection(student).parentDivision).name;
            case 'casteOrderNumber':
                return student.caste;
            case 'addressOrderNumber':
                return student.address;
            case 'attendanceOrderNumber':
                return `${this.studentAttendanceList.filter(att => att.parentStudent===student.id && att.status==='PRESENT')}/${this.studentAttendanceList.filter(att => att.parentStudent===student.id && att.status!=='HOLIDAY')}`
            case 'overallMarksOrderNumber':
                // To fix: Overallmarks
                return 100;
            case 'resultOrderNumber':
                // To fix: Result
                return 'PASS';
            case 'percentageOrderNumber':
                // To fix: Percentage
                return '90%';
            case 'promotedToClassOrderNumber':
                // To fix: Doesn't check pass fail?
                return this.getNextStep(student);
            case 'classAndSectionOrderNumber':
                return `${this.getClass(this.getStudentSection(student).parentClass).name}, ${this.getClass(this.getStudentSection(student).parentDivision).name}`;
        }
        return result;
    }

    getNextStep(student: any): any {
        switch (this.getClass(this.getStudentSection(student).parentClass).name) {
            case 'Play Group':
                return 'Promoted to Nursery';                
            case 'Nursery':
                return 'Promoted to L.K.G.';                
            case 'L.K.G.':
                return 'Promoted to U.K.G.';                
            case 'U.K.G.':
                return 'Promoted to Class - 1';                
            case 'Class - 1':
                return 'Promoted to Class - 2';                
            case 'Class - 2':
                return 'Promoted to Class - 3';                
            case 'Class - 3':
                return 'Promoted to Class - 4';                
            case 'Class - 4':
                return 'Promoted to Class - 5';                
            case 'Class - 5':
                return 'Promoted to Class - 6';                
            case 'Class - 6':
                return 'Promoted to Class - 7';                
            case 'Class - 7':
                return 'Promoted to Class - 8';                
            case 'Class - 8':
                return 'Promoted to Class - 9';                
            case 'Class - 9':
                return 'Promoted to Class - 10';                
            case 'Class - 10':
                return 'Promoted to Class - 11';                
            case 'Class - 11':
                return 'Promoted to Class - 12';                
            case 'Class - 12':
                return '';
                
        }
    }

    getSession = (id) => this.sessionList.find(x => x.id===id)
    getClass = (id) => this.classList.find(x => x.id===id)
    getGrade = id => this.gradeList.find(x => x.id===id)
    getSubGrade = id => this.subGradeList.find(x => x.id===id)
    getDivision = (id) => this.divisionList.find(x => x.id===id)
    getStudentSection = (student) => this.studentSectionList.find(x => x.parentStudent===student.id);

    getLayoutSubGradeList = layoutGrade => this.layoutSubGradeList.filter(x => this.getSubGrade(x.parentSubGrade).parentGrade===layoutGrade.parentGrade);

    getHeadersSorted = () => STUDENT_DETAILS_HEADER_KEYS.filter(key => this.layout[key]).sort((a,b) => this.layout[a]-this.layout[b]);
    getFootersSorted = () => STUDENT_DETAILS_FOOTER_KEYS.filter(key => this.layout[key]).sort((a,b) => this.layout[a]-this.layout[b]);

    getMarksNormalisedByExamColumn = (exam_type, layoutExamColumn, subject, student) => {
        if(exam_type==='Simple')exam_type=null;
        const maximumMarks = this.testList.find(x => x.parentExamination===layoutExamColumn.parentExamination && x.parentSubject===subject.id && x.parentClass===this.getStudentSection(student).parentClass && x.parentDivision===this.getStudentSection(student).parentDivision && x.testType===exam_type).maximumMarks;
        const marksObtained = this.studentTestList.find(x => x.parentExamination===layoutExamColumn.parentExamination && x.parentSubject===subject.id && x.parentStudent===student.id && x.testType===exam_type).marksObtained;
        if(exam_type===null || exam_type==='Oral' || exam_type==='Practical'){
            return marksObtained/maximumMarks*layoutExamColumn.maximumMarksObtainedOne;
        }
        return this.round(marksObtained/maximumMarks*layoutExamColumn.maximumMarksObtainedTwo);        
    }
    getTotalMarksByExamColumnSubject = (layoutExamColumn, subject, student) => this.round(layoutExamColumn.columnType.split('/').reduce((a,b)=>a+this.getMarksNormalisedByExamColumn(b, layoutExamColumn, subject, student), 0) )
    getTotalMarksBySubject = (subject, student) => this.round(this.layoutExamColumnList.reduce((a,b) => a+this.getTotalMarksByExamColumnSubject(b, subject, student), 0))
    getTotalMarksByExamColumn = (layoutExamColumn, student) => this.round(this.subjectList.reduce((a,b) => a+this.getTotalMarksByExamColumnSubject(layoutExamColumn, b, student), 0))
    getTotalMarks = student => this.round(this.subjectList.reduce((a,b) => a+this.getTotalMarksBySubject(b, student), 0));

    getMarksObtainedSubGrade = (layoutSubGrade, student) => this.studentSubGradeList.find(x => x.parentSubGrade===layoutSubGrade.parentSubGrade && x.parentStudent===student.id).gradeObtained;

    getStudentRemarks = student => this.studentRemarksList.find(x => x.parentStudent===student.id && x.parentSession===this.user.activeSchool.currentSessionDbId).remark

    getTotalColummnsInExamTable = () => 1 + ((this.layoutExamColumnList.length>1)?1:0) + this.layoutExamColumnList.reduce((a,b) => a+((b.columnType.split('/').length==1)?1:3), 0);

}
