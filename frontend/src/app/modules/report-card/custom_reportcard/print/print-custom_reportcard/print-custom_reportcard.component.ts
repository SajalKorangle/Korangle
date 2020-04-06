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

    session:any = '';
    
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
        this.studentRemarkList = value['studentRemarkList'];

        this.studentSectionList = value['studentSectionList'];

        this.gradeList = value['gradeList'];
        this.subGradeList = value['subGradeList'];
        this.studentSubGradeList = value['studentSubGradeList'];

        this.selectedClass = value['selectedClass'];
        this.selectedDivision = value['selectedDivision'];

        this.examinationList = value['examinationList'];

        this.subjectList = value['subjectList'];
        this.classSubjectList = value['classSubjectList'];
        this.studentSubjectList = value['studentSubjectList'];
        this.testSecondList = value['testSecondList'];
        this.studentTestList = value['studentTestList'];

        this.studentAttendanceList = value['studentAttendanceList'];

        this.selectedStudentList = value['selectedStudentList'];

        this.classTeacherSignatureList = value['classTeacherSignature'];
        this.session = value['session'];
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

    getParameterValue(key, student){
        let result:any = '';
        switch(key){
            case 'studentNameOrderNumber':
                result = student.name;
                break;
            case 'fatherNameOrderNumber':
                result = student.fathersName;
                break;
            case 'motherNameOrderNumber':
                result = student.motherName;
                break;
            case 'classOrderNumber':
                result = this.selectedClass.name;
                break;
            case 'rollNoOrderNumber':
                let temp = this.studentSectionList.find(item=>{return item.parentStudent == student.id});
                if(temp == undefined) result = '';
                else {
                    result = temp.rollNumber;
                }
                break;
            case 'scholarNoOrderNumber':
                result = student.scholarNumber;
                break;
            case 'dateOfBirthOrderNumber':
                result = student.dateOfBirth;
                break;
            case 'dateOfBirthInWordsOrderNumber':
                result = this.dateInWords.transform(student.dateOfBirth);
                break; 
            case 'aadharNumberOrderNumber':
                result = student.aadharNum;
                break; 
            case 'categoryOrderNumber':
                result = student.newCategoryField;
                break; 
            case 'familySSMIDOrderNumber':
                result = student.familySSMID;
                break;
            case 'childSSMIDOrderNumber': 
                result = student.childSSMID;
                break;
            case 'sectionOrderNumber': 
                result = this.selectedDivision.name;
                break;
            case 'casteOrderNumber':
                result = student.caste;
                break;
            case 'addressOrderNumber':
                result = student.address;
                break;
            case 'attendanceOrderNumber':
                result = this.studentAttendanceList.filter(studentAttendance=>{
                    return studentAttendance.status == 'PRESENT'; 
                }).length +'/' + this.studentAttendanceList.filter(studentAttendance=>{
                    return studentAttendance.status != 'HOLIDAY';
                }).length;
                break;
            case 'overallMarksOrderNumber':
                result = this.getGrandTotal(student); // only for main subjects
                break;
            case 'resultOrderNumber':
            // Calulate from grand total of that subject and only for main subject
                result = ''; // one subject fail then supplementary,if two then fail, Do it in manage layout=(minimum passing percentage, no of suplementary subjects)
                break;
            case 'percentageOrderNumber':
            let marks_obtained = this.getGrandTotal(student);
            let total_marks = this.layoutExamColumnList.map(item=>{
                    let total = 0;
                    if(item.columnType.split('/').length == 1){
                        total += parseInt(item.maximumMarksObtainedOne);
                    }else{
                        total += parseInt(item.maximumMarksObtainedOne) + parseInt(item.maximumMarksObtainedTwo);
                    }
                    let subjectCount = this.getMainSubjects(student.id).length;
                    return total*subjectCount;
                }).reduce(((total,item)=>{
                    return total + item;
                }),0.0);

                result = ((marks_obtained*1.0)/total_marks)*100;
                result = result.toFixed(this.layout.decimalPlaces); 
                break;
            case 'promotedToClassOrderNumber':
                result = this.getNextStep(student);
                break;
            case 'classAndSectionOrderNumber':
                result = this.selectedClass.name + ','+this.selectedDivision.name;
                break;
        }
        return result;

    }
    getActiveKeys(parameter_list){
        let temp = [];

        Object.keys(parameter_list).forEach(key=>{
            if(this.layout[key] != 0) temp.push(key);
        });

        temp.sort((a,b)=>{
            return this.layout[a] - this.layout[b]; 
        });

        return temp;
    }

    getTotalColummnsInExamTable():Number{
        let total = 0;
        this.layoutExamColumnList.forEach(layoutExamColumn=>{
            let len = layoutExamColumn.columnType.split('/').length;
            total += len;
            if(len > 1) total += 1;
        });
        if(this.layoutExamColumnList.length > 1) total += 1;
        return total + 1;
    }

    getGradeName(grade_id){
        let grade = this.gradeList.find(item=>{
            if(item.id == grade_id) return true;
            return false;
        });
        if(grade == undefined) return '';
        return grade.name;
    }

    getFilteredLayoutSubGradeList(layoutGrade){
        return this.layoutSubGradeList.filter(item=>{
            return item.parentLayoutGrade == layoutGrade.id;
        });
    }

    getSubGradeName(subGrade_id){
        let temp = this.subGradeList.find(item=>{
            return item.id == subGrade_id;
        });
        if(temp == undefined) return '';
        return temp.name;
    }

    getSubGradeMarks(subGrade_id,student){

        let marks = this.studentSubGradeList.find(item=>{
            return item.parentSubGrade == subGrade_id && item.parentStudent == student.id;
        });
        if(marks == undefined) return '';

        return marks.gradeObtained;
    }

    getStudentRemark(student){
        let remark =this.studentRemarkList.find(item=>{return item.parentStudent == student.id});

        if(remark == undefined) return '';

        return remark.remark;
    }

    getMainSubjects(student_id){
        let temp = [];

        this.studentSubjectList.filter(studentSubject=>{
            return studentSubject.parentStudent == student_id;
        }).forEach(studentSubject=>{
            temp.push(this.subjectList.find(item=>{return item.id == studentSubject.parentSubject}));
        });

        return temp.filter(item=>{
            let classSubject = this.classSubjectList.find(classSubject=>{return classSubject.parentSubject == item.id});
            return classSubject.mainSubject == 1;
        }).sort((a,b)=>{
            let a_orderNumber = this.classSubjectList.find(classSubject=>{return classSubject.parentSubject == a.id}).orderNumber;
            let b_orderNumber = this.classSubjectList.find(classSubject=>{return classSubject.parentSubject == b.id}).orderNumber;
            return a_orderNumber - b_orderNumber;
        });
    }

    getNonMainSubjects(student_id){
        let temp = [];

        this.studentSubjectList.filter(studentSubject=>{
            return studentSubject.parentStudent == student_id;
        }).forEach(studentSubject=>{
            temp.push(this.subjectList.find(item=>{return item.id == studentSubject.parentSubject}));
        });

        return temp.filter(item=>{
            let classSubject = this.classSubjectList.find(classSubject=>{return classSubject.parentSubject == item.id});
            return classSubject.mainSubject == 0;
        }).sort((a,b)=>{
            let a_orderNumber = this.classSubjectList.find(classSubject=>{return classSubject.parentSubject == a.id}).orderNumber;
            let b_orderNumber = this.classSubjectList.find(classSubject=>{return classSubject.parentSubject == b.id}).orderNumber;
            return a_orderNumber - b_orderNumber;
        });
    }

    getSubjectMarks(layoutExamColumn, subject, student){

        let total = 0.0;
        let studentTestList = this.studentTestList.filter(studentTest=>{
            return studentTest.parentExamination == layoutExamColumn.parentExamination &&
                    studentTest.parentSubject == subject.id &&
                    studentTest.parentStudent == student.id;
        });

        let testSecondList = this.testSecondList.filter(testSecond=>{
            return testSecond.parentClass == this.selectedClass.id &&
                    testSecond.parentDivision == this.selectedDivision.id &&
                    testSecond.parentExamination == layoutExamColumn.parentExamination &&
                    testSecond.parentSubject == subject.id;
        });

        if(layoutExamColumn.columnType.split('/').length == 1){
            let marks = 0.00;
            let maximum_marks = 0.00;
            studentTestList.forEach(item=>{
                marks += parseFloat(item.marksObtained);
            });
            testSecondList.forEach(item=>{
                maximum_marks += parseFloat(item.maximumMarks);
            });
            let final_marks:Number = layoutExamColumn.maximumMarksObtainedOne*((marks*1.0)/maximum_marks);
            final_marks = parseFloat(final_marks.toFixed(this.layout.decimalPlaces));
            return [final_marks];
        }

        let temp_marks:any = ['','',''];

        studentTestList.forEach(studentTest=>{
            let isFound = false;
            let marks = parseFloat(studentTest.marksObtained);

            if(studentTest.testType == layoutExamColumn.columnType.split('/')[0]){
                let maximum_marks = testSecondList.find(item=>{return item.testType == studentTest.testType});
                if(maximum_marks != undefined){
                    isFound = true;
                    maximum_marks = parseFloat(maximum_marks.maximumMarks);
                    marks = layoutExamColumn.maximumMarksObtainedOne*((marks*1.0)/maximum_marks);
                    marks = parseFloat(marks.toFixed(this.layout.decimalPlaces));
                }
            }
            if(studentTest.testType == layoutExamColumn.columnType.split('/')[1]){
                let maximum_marks = testSecondList.find(item=>{return item.testType == studentTest.testType});
                if(maximum_marks != undefined){
                    isFound = true;
                    maximum_marks = parseFloat(maximum_marks.maximumMarks);
                    marks = layoutExamColumn.maximumMarksObtainedTwo*((marks*1.0)/maximum_marks);
                    marks = parseFloat(marks.toFixed(this.layout.decimalPlaces));
                }
            }


            if(isFound == true && (studentTest.testType == 'Oral' || studentTest.testType == 'Practical'))
                temp_marks[0] = marks;
            
            if(isFound == true && (studentTest.testType == 'Written' || studentTest.testType == 'Theory'))
                temp_marks[1] = marks;

            total += marks;

        });
        temp_marks[2] = total.toFixed(this.layout.decimalPlaces);
        return temp_marks;
        
    }

    getSubjectTotal(subject, student){

        let total = 0.0;
        this.layoutExamColumnList.forEach(layoutExamColumn=>{
            let marks = this.getSubjectMarks(layoutExamColumn,subject,student);

            if(marks.length == 1)
                total += parseFloat(marks[0]);
            else
                total += parseFloat(marks[2]);
        });
        
        return total;
    }

    getLayoutExamColumnTotal(layoutExamColumn, student){

        let subjectList = this.getMainSubjects(student.id);

        let total = 0.0;
        subjectList.forEach(subject=>{
            let marks = this.getSubjectMarks(layoutExamColumn,subject,student);

            if(marks.length == 1)
                total += parseFloat(marks[0]);
            else
                total += parseFloat(marks[2]);
        });

        return total;
    }

    getGrandTotal(student){

        let subjectList = this.getMainSubjects(student.id);

        let total = 0.0;
        subjectList.forEach(subject=>{
            let marks = this.getSubjectTotal(subject,student);

            total += marks;
        });

        return total;
    }

    getGrandTotalInWords(student){
        return this.amountInWords.transform(this.getGrandTotal(student));
    }
    getNextStep(student: any): any {
        let result = '';
        switch(this.selectedClass.name) {
            case 'Play Group':
                result = 'Promoted to Nursery';
                break;
            case 'Nursery':
                result = 'Promoted to L.K.G.';
                break;
            case 'L.K.G.':
                result = 'Promoted to U.K.G.';
                break;
            case 'U.K.G.':
                result = 'Promoted to Class - 1';
                break;
            case 'Class - 1':
                result = 'Promoted to Class - 2';
                break;
            case 'Class - 2':
                result = 'Promoted to Class - 3';
                break;
            case 'Class - 3':
                result = 'Promoted to Class - 4';
                break;
            case 'Class - 4':
                result = 'Promoted to Class - 5';
                break;
            case 'Class - 5':
                result = 'Promoted to Class - 6';
                break;
            case 'Class - 6':
                result = 'Promoted to Class - 7';
                break;
            case 'Class - 7':
                result = 'Promoted to Class - 8';
                break;
            case 'Class - 8':
                result = 'Promoted to Class - 9';
                break;
            case 'Class - 9':
                result = 'Promoted to Class - 10';
                break;
            case 'Class - 10':
                result = 'Promoted to Class - 11';
                break;
            case 'Class - 11':
                result = 'Promoted to Class - 12';
                break;
            case 'Class - 12':
                result = '';
                break;
        }
        return result;
    }
}
