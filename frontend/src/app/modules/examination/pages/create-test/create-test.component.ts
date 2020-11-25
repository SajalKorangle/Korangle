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

@Component({
    selector: 'create-test',
    templateUrl: './create-test.component.html',
    styleUrls: ['./create-test.component.css'],
    providers: [ ExaminationOldService, ClassService, SubjectOldService, StudentOldService, ExaminationService, SubjectService ],
})

export class CreateTestComponent implements OnInit {


    /* These are newly created properties*/


    selectedExaminationNew :any;

    newTestList : Array<{
        'deleted':boolean,
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

    isTestUpdateDisabled(test: any): boolean {
        if (test.newMaximumMarks !== test.maximumMarks) {
            return false;
        }
        if (test.newTestType !== test.testType)
            return false;

        return true;
    }

    //This function is used to create a basic test template for all subjects in the selected class and section
    createBasicTestForAllSubj()
    {   
        console.log("Basic Test creation called...");
        
        this.selectedDate = this.formatDate(new Date(),'');
    
        for(let i=0;i<this.subjectList.length;i++)
        {
            this.selectedSubject = this.subjectList[i];
            this.serviceAdapter.createTest();
        }
        this.serviceAdapter.getTestAndSubjectDetails();

    }

    //This function creates specific test by chosen subject name
    createSpecificTest()
    {
        console.log("Subject wise test creation called...");

        this.selectedDate = this.formatDate(new Date(),'');

        this.serviceAdapter.createTest();
    }

    //Update maximum Marks of all the test at once
    updateAll()
    {
        
        this.selectedExamination.selectedClass.selectedSection.testList.forEach(test => {
            test.newMaximumMarks = this.selectedMaximumMarks;
            this.serviceAdapter.updateTest(test);
        });
        
    } 

}