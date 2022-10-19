import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { SubjectService } from 'app/services/modules/subject/subject.service';

import { CreateTestServiceAdapter } from './create-test.service.adapter';
import { TEST_TYPE_LIST } from '../../../../classes/constants/test-type';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'create-test',
    templateUrl: './create-test.component.html',
    styleUrls: ['./create-test.component.css'],
    providers: [ExaminationService, ClassService, SubjectService],
})
export class CreateTestComponent implements OnInit {
    showSelectedClassAndSection: any = [];
    selectedExaminationNew: any;

    newTestList: Array<{
        deleted: boolean;
        parentExamination: any;
        subjectId: any;
        subjectName: any;
        testType: any;
        newTestType: any;
        maximumMarks: any;
        newMaximumMarks: any;
        classList: Array<{
            classId: any;
            className: any;
            sectionList: Array<{
                sectionId: any;
                sectionName: any;
                testId: any;
            }>;
        }>;
    }>;

    templateTestList: Array<{
        deleted: boolean;
        parentExamination: any;
        subjectId: any;
        subjectName: any;
        testType: any;
        newTestType: any;
        maximumMarks: any;
        newMaximumMarks: any;
        classList: Array<{
            classId: any;
            className: any;
            sectionList: Array<{
                sectionId: any;
                sectionName: any;
                testId: any;
            }>;
        }>;
    }>;

    isUpdated = false;

    user;

    showTestDetails = false;
    fetchedList: any;
    dataCanBeFetched = true;
    selectedExamination: any = undefined;

    examinationList: any = [];
    examinationClassSectionList: any;

    classSectionSubjectList: Array<{
        className: any;
        classId: any;
        sectionList: Array<{
            sectionName: any;
            sectionId: any;
            selected: boolean;
            subjectList: Array<{
                subjectName: any;
                subjectId: any;
            }>;
        }>;
    }>;

    subjectList: any;

    // For New Test
    selectedSubject: any;
    selectedDate: any;
    selectedStartTime = '10:30';
    selectedEndTime = '13:30';
    selectedTestType = null;
    selectedMaximumMarks = 100;

    testTypeList = TEST_TYPE_LIST;

    serviceAdapter: CreateTestServiceAdapter;

    isInitialLoading = false;

    isLoading = false;

    constructor(
        public examinationService: ExaminationService,
        public classService: ClassService,
        public subjectNewService: SubjectService,
        public cdRef: ChangeDetectorRef
    ) {}

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

    //This function is used to create a basic test template for all subjects in the selected class and section
    createTestFromTemplate() {
        this.newTestList = [];

        for (let i = 0; i < this.serviceAdapter.classListForTest.length; i++) {
            this.subjectList.forEach((sub) => {
                let test = {
                    id: null,
                    parentExamination: this.selectedExamination,
                    parentClass: this.serviceAdapter.classListForTest[i],
                    parentDivision: this.serviceAdapter.sectionListForTest[i],
                    parentSubject: sub.id,
                    startTime: '2019-07-01T11:30:00+05:30',
                    endTime: '2019-07-01T13:30:00+05:30',
                    testType: null,
                    maximumMarks: 100,
                };

                var subIdx = this.newTestList.findIndex(
                    (sub) =>
                        sub.subjectId === test.parentSubject && sub.testType === test.testType && sub.maximumMarks === test.maximumMarks
                );

                var classIdx = -1,
                    sectionIdx = -1;

                if (subIdx != -1) {
                    classIdx = this.newTestList[subIdx].classList.findIndex((cl) => cl.classId === test.parentClass);

                    if (classIdx != -1) {
                        sectionIdx = this.newTestList[subIdx].classList[classIdx].sectionList.findIndex(
                            (sec) => sec.sectionId === test.parentDivision
                        );
                    }
                }

                let tempSection = {
                    sectionName: this.serviceAdapter.getSectionName(test.parentDivision),
                    sectionId: test.parentDivision,
                    testId: test.id,
                };

                let tempSectionList = [];
                tempSectionList.push(tempSection);

                let tempClass = {
                    className: this.serviceAdapter.getClassName(test.parentClass),
                    classId: test.parentClass,
                    sectionList: tempSectionList,
                };
                let tempClassList = [];
                tempClassList.push(tempClass);

                let tempSubject = {
                    parentExamination: test.parentExamination,
                    deleted: false,
                    subjectId: test.parentSubject,
                    subjectName: this.serviceAdapter.getSubjectName(test.parentSubject),
                    testType: test.testType,
                    newTestType: test.testType,
                    maximumMarks: test.maximumMarks,
                    newMaximumMarks: test.maximumMarks,
                    classList: tempClassList,
                };

                if (subIdx === -1) {
                    this.newTestList.push(tempSubject);
                } else if (classIdx === -1) {
                    this.newTestList[subIdx].classList.push(tempClass);
                } else if (sectionIdx === -1) {
                    this.newTestList[subIdx].classList[classIdx].sectionList.push(tempSection);
                }
            });
        }
    }

    //It handles which test type can be selected
    handleTestTypeSelection(value: any, ngModelControl: NgModel, test: any) {
        if (this.findAnyDuplicate(test, value)) {
            alert('Test already exists!!');
            ngModelControl.control.setValue(test.testType);
            test.newTestType = test.testType;
            this.cdRef.detectChanges();
        }
    }

    //This function creates specific test by chosen subject name
    createSpecificTest() {
        if (this.selectedSubject === null) {
            alert('Subject should be selected');
            return;
        }

        if (this.selectedTestType === 0) {
            this.selectedTestType = null;
        }

        if (!this.serviceAdapter.isOnlyGrade(this.selectedSubject.id) && (!this.selectedMaximumMarks || this.selectedMaximumMarks < 1)) {
            alert('Invalid Maximum Marks');
            return;
        }

        //this.selectedDate = this.formatDate(new Date(),'');

        for (let i = 0; i < this.serviceAdapter.classListForTest.length; i++) {
            let test = {
                id: null,
                parentExamination: this.selectedExamination,
                parentClass: this.serviceAdapter.classListForTest[i],
                parentDivision: this.serviceAdapter.sectionListForTest[i],
                parentSubject: this.selectedSubject,
                startTime: '2019-07-01T11:30:00+05:30',
                endTime: '2019-07-01T13:30:00+05:30',
                testType: this.selectedTestType,
                maximumMarks: this.selectedMaximumMarks,
            };

            var subIdx = this.newTestList.findIndex(
                (sub) => sub.subjectId === test.parentSubject && (sub.testType === test.testType || sub.newTestType === test.testType)
            );

            var classIdx = -1,
                sectionIdx = -1;

            if (subIdx != -1) {
                classIdx = this.newTestList[subIdx].classList.findIndex((cl) => cl.classId === test.parentClass);

                if (classIdx != -1) {
                    sectionIdx = this.newTestList[subIdx].classList[classIdx].sectionList.findIndex(
                        (sec) => sec.sectionId === test.parentDivision
                    );
                }
            }

            let tempSection = {
                sectionName: this.serviceAdapter.getSectionName(test.parentDivision),
                sectionId: test.parentDivision,
                testId: test.id,
            };

            let tempSectionList = [];
            tempSectionList.push(tempSection);

            let tempClass = {
                className: this.serviceAdapter.getClassName(test.parentClass),
                classId: test.parentClass,
                sectionList: tempSectionList,
            };
            let tempClassList = [];
            tempClassList.push(tempClass);

            let tempSubject = {
                parentExamination: test.parentExamination,
                deleted: false,
                subjectId: test.parentSubject,
                subjectName: this.serviceAdapter.getSubjectName(test.parentSubject),
                testType: test.testType,
                newTestType: test.testType,
                maximumMarks: test.maximumMarks,
                newMaximumMarks: test.maximumMarks,
                classList: tempClassList,
            };

            if (subIdx === -1) {
                this.newTestList.push(tempSubject);
            } else if (classIdx === -1) {
                this.newTestList[subIdx].classList.push(tempClass);
            } else if (sectionIdx === -1) {
                this.newTestList[subIdx].classList[classIdx].sectionList.push(tempSection);
            } else {
                alert('Test already exists!!');
                this.selectedTestType = null;
                this.selectedSubject = null;
                return;
            }
        }

        this.handleUpdate('', '');
    }

    //It handles the update button
    handleUpdate(value: any, test: any): void {
        var update = false;
        this.newTestList.forEach((test) => {
            if (test.classList[0].sectionList[0].testId === null) {
                if (!test.deleted) update = true;
            } else {
                if (test.deleted) update = true;
                if (test.newMaximumMarks != test.maximumMarks || test.newTestType != test.testType) update = true;
            }
        });
        if (update) this.isUpdated = true;
        else this.isUpdated = false;
    }

    //Check if current test is created for all the selected class and section
    containsAllClass(test: any): boolean {
        var containsAll = true;

        this.showSelectedClassAndSection.forEach((item) => {
            var cl = item.className;
            var sec = item.sectionName;
            var clFound = false;
            test.classList.forEach((clas) => {
                if (clas.className === cl) {
                    clFound = true;
                    var secIndex = clas.sectionList.findIndex((secc) => secc.sectionName === sec);
                    if (secIndex === -1) containsAll = false;
                }
            });
            if (!clFound) containsAll = false;
        });

        return containsAll;
    }

    //Reset the test list view if not updated or simply get the backend test list
    resetList(): void {
        this.serviceAdapter.getTestAndSubjectDetails();
        this.isUpdated = false;
    }

    //Check for any duplicate test is present or not
    findAnyDuplicate(tempTest: any, value: any): boolean {
        var ans = false;
        var count = 0;
        tempTest.classList.forEach((cl) => {
            cl.sectionList.forEach((sec) => {
                this.newTestList.forEach((test) => {
                    if (test.subjectId === tempTest.subjectId && (test.newTestType === value || test.testType === value)) {
                        test.classList.forEach((cll) => {
                            if (cll.classId === cl.classId) {
                                cll.sectionList.forEach((secc) => {
                                    if (secc.sectionId === sec.sectionId) {
                                        if (secc.testId != sec.testId) ans = true;
                                        else {
                                            count++;
                                            if (count == 2) ans = true;
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });

        return ans;
    }
}
