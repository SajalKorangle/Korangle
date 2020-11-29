import { Component, Input, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { SubjectOldService } from '../../../../services/modules/subject/subject-old.service';

import { CreateTestServiceAdapter } from './create-test.service.adapter';
import {TEST_TYPE_LIST} from '../../../../classes/constants/test-type';
import {StudentOldService} from '../../../../services/modules/student/student-old.service';
import {DataStorage} from "../../../../classes/data-storage";
import { MatLineSetter } from '@angular/material';
import { StudentService } from 'app/services/modules/student/student.service';
import { SubjectService } from 'app/services/modules/subject/subject.service';
import { temporaryDeclaration } from '@angular/compiler/src/compiler_util/expression_converter';
import { NgModel } from '@angular/forms';

@Component({
    selector: 'create-test',
    templateUrl: './create-test.component.html',
    styleUrls: ['./create-test.component.css'],
    providers: [ ExaminationOldService, ClassService, SubjectOldService, StudentOldService, ExaminationService, SubjectService ],
})

export class CreateTestComponent implements OnInit {


    /* These are newly created properties*/

    showSelectedClassAndSection :any =[];
    selectedExaminationNew :any;

    newTestList : Array<{
        'deleted':boolean,
        'parentExamination':any,
        'subjectId':any,
        'subjectName':any,
        'testType':any,
        'newTestType' :any,
        'maximumMarks':any,
        'newMaximumMarks' :any,
        'classList': Array<{
            'classId' : any,
            'className' : any,
            'sectionList': Array<{
                'sectionId' : any,
                'sectionName' : any,
                'testId':any,
            }>
        }>
    }>;


    templateTestList : Array<{
        'deleted':boolean,
        'parentExamination':any,
        'subjectId':any,
        'subjectName':any,
        'testType':any,
        'newTestType' :any,
        'maximumMarks':any,
        'newMaximumMarks' :any,
        'classList': Array<{
            'classId' : any,
            'className' : any,
            'sectionList': Array<{
                'sectionId' : any,
                'sectionName' : any,
                'testId':any,
            }>
        }>
    }>;




















    /*Above are newly created variables */

    user;

    showTestDetails = false;

    selectedExamination: any;
    examinationClassSectionList: any;

    classSectionSubjectList= [];

    subjectList: any;

    // For New Test
    selectedSubject: any;
    selectedDate : any;
    selectedStartTime = "10:30";
    selectedEndTime = "13:30";
    selectedTestType = null;
    selectedMaximumMarks = 100;

    testTypeList = TEST_TYPE_LIST;

    serviceAdapter: CreateTestServiceAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(public examinationOldService: ExaminationOldService,
                public examinationService: ExaminationService,
                public classService: ClassService,
                public subjectService: SubjectOldService,
                public studentService: StudentOldService,
                
                public subjectNewService: SubjectService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new CreateTestServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        
    }

    onDateSelected(event: any): void {
        this.selectedDate = this.formatDate(event, '');
    }

    formatDate(dateStr: any, status: any): any {

        let d = new Date(dateStr);

        if (status === 'firstDate') {
            d = new Date(d.getFullYear(), d.getMonth(), 1);
        } else if (status === 'lastDate') {
            d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getTestDate(test: any): any {
        return new Date(test.startTime);
    }

    onTestDateUpdation(test: any, event: any): void {
        test.newDate = this.formatDate(event, '');
    }

    isTestUpdateDisabled(): boolean {
        if(this.enableUpdateButton)return false;

        return true;
    }

    //This function is used to create a basic test template for all subjects in the selected class and section
    createTestFromTemplate()
    {   
        console.log("Basic Test creation called...");
        this.newTestList = [];
        
        //this.selectedDate = this.formatDate(new Date(),'');

        for(let i=0;i<this.serviceAdapter.classListForTest.length;i++)
        {   
            this.subjectList.forEach(sub => {

                let test = {
                    'id': null,
                    'parentExamination': this.selectedExamination.id,
                    'parentClass': this.serviceAdapter.classListForTest[i],
                    'parentDivision':this.serviceAdapter.sectionListForTest[i],
                    'parentSubject': sub.id,
                    'startTime':"2019-07-01T11:30:00+05:30",
                    'endTime':"2019-07-01T13:30:00+05:30",
                    'testType': null,
                    'maximumMarks': 100,
                };
                

                var subIdx = this.newTestList.findIndex(sub =>sub.subjectId === test.parentSubject && sub.testType === test.testType && sub.maximumMarks === test.maximumMarks);

                var classIdx = -1, sectionIdx = -1;

                if(subIdx != -1)
                {
                    classIdx = this.newTestList[subIdx].classList.findIndex(cl => cl.classId === test.parentClass);

                    if(classIdx != -1)
                    {
                        sectionIdx = this.newTestList[subIdx].classList[classIdx].sectionList.findIndex(sec => sec.sectionId === test.parentDivision);
                    }
                }


                let tempSection = {
                    'sectionName' : this.serviceAdapter.getSectionName(test.parentDivision),
                    'sectionId' : test.parentDivision,
                    'testId' : test.id,
                   
                }

                let tempSectionList = [];
                tempSectionList.push(tempSection);


                let tempClass = {
                    'className' : this.serviceAdapter.getClassName(test.parentClass),
                    'classId' : test.parentClass,
                    'sectionList':tempSectionList,
                }
                let tempClassList = [];
                tempClassList.push(tempClass);

                let tempSubject = {
                    'parentExamination' : test.parentExamination,
                    'deleted':false,
                    'subjectId':test.parentSubject,
                    'subjectName':this.serviceAdapter.getSubjectName(test.parentSubject),
                    'testType':test.testType,
                    'newTestType' :test.testType,
                    'maximumMarks':test.maximumMarks,
                    'newMaximumMarks' :test.maximumMarks,
                    'classList' : tempClassList,
                }

                if(subIdx === -1)
                {
                    this.newTestList.push(tempSubject);
                }
                else if(classIdx === -1)
                {
                    this.newTestList[subIdx].classList.push(tempClass);
                }
                else if(sectionIdx === -1)
                {
                    this.newTestList[subIdx].classList[classIdx].sectionList.push(tempSection);
                }


            });
        }
        

    }
    ok =true;

    //This handle which test type can be selected
    handleTestTypeSelection(value :any, ngModelControl: NgModel,test :any)
    {         

        
        if(this.serviceAdapter.findAnyDuplicate(test,value))
        {
            ngModelControl.control.setValue(test.testType);
            console.log("not changing the value");
            alert('Similar Test is already in the template');
            test.newTestType = test.testType;
            console.log(test);
        }
        else
        {
            console.log("changing the value");
            console.log(test);
        }

    }

    //This function creates specific test by chosen subject name
    createSpecificTest()
    {
        console.log("Subject wise test creation called...");

        // this.selectedDate = this.formatDate(new Date(),'');

        if (this.selectedSubject === null) {
            alert('Subject should be selected');
            return;
        }

        

        if (this.selectedTestType === 0) {
            this.selectedTestType = null;
        }

        if (!this.serviceAdapter.isOnlyGrade(this.selectedSubject.id)
            && (!this.selectedMaximumMarks || this.selectedMaximumMarks < 1)) {
            alert('Invalid Maximum Marks');
            return;
        }
        
        //this.selectedDate = this.formatDate(new Date(),'');

        for(let i=0;i<this.serviceAdapter.classListForTest.length;i++)
        {   


                let test = {
                    'id': null,
                    'parentExamination': this.selectedExamination.id,
                    'parentClass': this.serviceAdapter.classListForTest[i],
                    'parentDivision':this.serviceAdapter.sectionListForTest[i],
                    'parentSubject': this.selectedSubject.id,
                    'startTime':"2019-07-01T11:30:00+05:30",
                    'endTime':"2019-07-01T13:30:00+05:30",
                    'testType': this.selectedTestType,
                    'maximumMarks': this.selectedMaximumMarks,
                };
                

                var subIdx = this.newTestList.findIndex(sub =>sub.subjectId === test.parentSubject && sub.testType === test.testType && sub.maximumMarks === test.maximumMarks);

                var classIdx = -1, sectionIdx = -1;

                if(subIdx != -1)
                {
                    classIdx = this.newTestList[subIdx].classList.findIndex(cl => cl.classId === test.parentClass);

                    if(classIdx != -1)
                    {
                        sectionIdx = this.newTestList[subIdx].classList[classIdx].sectionList.findIndex(sec => sec.sectionId === test.parentDivision);
                    }
                }


                let tempSection = {
                    'sectionName' : this.serviceAdapter.getSectionName(test.parentDivision),
                    'sectionId' : test.parentDivision,
                    'testId' : test.id,
                   
                }

                let tempSectionList = [];
                tempSectionList.push(tempSection);


                let tempClass = {
                    'className' : this.serviceAdapter.getClassName(test.parentClass),
                    'classId' : test.parentClass,
                    'sectionList':tempSectionList,
                }
                let tempClassList = [];
                tempClassList.push(tempClass);

                let tempSubject = {
                    'parentExamination' : test.parentExamination,
                    'deleted':false,
                    'subjectId':test.parentSubject,
                    'subjectName':this.serviceAdapter.getSubjectName(test.parentSubject),
                    'testType':test.testType,
                    'newTestType' :test.testType,
                    'maximumMarks':test.maximumMarks,
                    'newMaximumMarks' :test.maximumMarks,
                    'classList' : tempClassList,
                }

                if(subIdx === -1)
                {
                    this.newTestList.push(tempSubject);
                }
                else if(classIdx === -1)
                {
                    this.newTestList[subIdx].classList.push(tempClass);
                }
                else if(sectionIdx === -1)
                {
                    this.newTestList[subIdx].classList[classIdx].sectionList.push(tempSection);
                }
                else
                {
                    alert('Similar test is already in the template...');
                    this.selectedTestType = null;
                    this.selectedSubject = null;
                    return ;
                }



            
        }
    }

    //Update maximum Marks of all the test at once
    updateAll()
    {
        
        this.selectedExamination.selectedClass.selectedSection.testList.forEach(test => {
            test.newMaximumMarks = this.selectedMaximumMarks;
            this.serviceAdapter.updateTest(test);
        });
        
    }
    
    enableUpdateButton = false;
    handleUpdate(value : any,test : any): void {
        console.log(value);
        if(test.TestType != value)
        this.enableUpdateButton = true;
    }

}