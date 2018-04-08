import { Component, Input, OnInit } from '@angular/core';

import { MarksheetService } from '../marksheet.service';
import {StudentService} from '../../students/student.service';

import {Classs} from '../../classes/classs';
import {Section} from '../../classes/section';
import {StudentTest} from '../classes/student-test';

@Component({
    selector: 'app-update-marks',
    templateUrl: './update-marks.component.html',
    styleUrls: ['./update-marks.component.css'],
    providers: [ MarksheetService, StudentService ]
})

export class UpdateMarksComponent implements OnInit {

    @Input() user;

    selectedClass: Classs;
    selectedSection: Section;
    selectedStudent: StudentTest;

    classSectionStudentList: Classs[] = [];

    currentStudent: StudentTest = new StudentTest();

    subjectList = [];

    maximumMarksAllowedList = [];

    workingDays: number;

    isLoading = false;

    constructor(private marksheetService: MarksheetService,
                private studentService: StudentService) { }

    changeSelectedSectionToFirst(): void {
        this.selectedSection = this.selectedClass.sectionList[0];
        this.changeSelectedStudentToFirst();
    }

    changeSelectedStudentToFirst(): void {
        this.selectedStudent = this.selectedSection.studentList[0] as StudentTest;
        this.currentStudent.copyTest(this.selectedStudent);
    }

    ngOnInit(): void {
        const data = {
            sessionDbId: this.user.schoolCurrentSessionDbId,
        }
        this.studentService.getClassSectionStudentList(data, this.user.jwt).then(
            classSectionStudentList => {
                this.isLoading = false;
                classSectionStudentList.forEach( classs => {
                    const tempClass = new Classs();
                    tempClass.name = classs.name;
                    tempClass.dbId = classs.dbId;
                    classs.sectionList.forEach( section => {
                        const tempSection = new Section();
                        tempSection.name = section.name;
                        tempSection.dbId = section.dbId;
                        let prevStudent;
                        section.studentList.forEach( student => {
                            const tempStudent = new StudentTest();
                            tempStudent.name = student.name;
                            tempStudent.dbId = student.dbId;
                            tempStudent.scholarNumber = student.scholarNumber;
                            if (prevStudent !== undefined && prevStudent.name === tempStudent.name) {
                                prevStudent.showScholarNumber = true;
                                tempStudent.showScholarNumber = true;
                            }
                            prevStudent = tempStudent;
                            tempSection.studentList.push(tempStudent);
                        });
                        tempClass.sectionList.push(tempSection);
                    });
                    this.classSectionStudentList.push(tempClass);
                });
                if (this.classSectionStudentList.length > 0) {
                    this.selectedClass = this.classSectionStudentList[0];
                    this.changeSelectedSectionToFirst();
                } else {
                    alert('Student needs to be added first, before marks updation');
                }

            }
        );
        this.marksheetService.getSubjectList(this.user.jwt).then(
            subjectList => {
                this.subjectList = subjectList;
                // dbId, name
            }
        );
        this.marksheetService.getMaximumMarksAllowedList(this.user.jwt).then(
            maximumMarksAllowedList => {
                this.maximumMarksAllowedList = maximumMarksAllowedList
                // dbId, marks
            }
        );
    }

    getStudentMarks(): void {
        this.isLoading = true;
        const data = {
            studentDbId: this.selectedStudent.dbId,
            sectionDbId: this.selectedSection.dbId,
        };
        this.marksheetService.getMarksUrl(data, this.user.jwt).then(
            data => {
                this.isLoading = false;
                if (this.selectedStudent.dbId.toString() === data.studentDbId.toString()) {
                    this.selectedStudent.scholarNumber = data.scholarNumber;
                    this.selectedStudent.resultList = data.result;
                    this.selectedStudent.attendance = data.attendance;
                    this.workingDays = data.workingDays;
                    this.currentStudent.copyTest(this.selectedStudent);
                }
            }, error => {
                this.isLoading = false;
            }
        );
    }

    updateMarks(): void {

        if (this.currentStudent.attendance === null) {
            alert('Attendance should be defined');
            return;
        }

        if (this.currentStudent.attendance > this.workingDays) {
            alert('Attendance is greater than maximum number of school days');
            return;
        }

        let data = {
            studentDbId: this.selectedStudent.dbId,
            sectionDbId: this.selectedSection.dbId,
            result: [],
            attendance: this.currentStudent.attendance,
        };

        let error = false;
        this.currentStudent.resultList.forEach( result => {
            if (result.marksObtained === null) {
                alert('Marks obtained can not be empty');
                error = true;
                return;
            } else if (result.marksObtained > this.getMaximumMarks(result.maximumMarksAllowedDbId)) {
                alert(this.getSubjectName(result.subjectDbId) + ': ' + result.marksObtained + ' marks are greater than max. marks');
                error = true;
                return;
            } else {
                const tempResult = {
                    testDbId: result.testDbId,
                    marksObtained: result.marksObtained,
                };
                data['result'].push(tempResult);
            }
        });

        if (error) {
            return;
        }

        this.isLoading = true;
        this.marksheetService.updateMarks(data, this.user.jwt).then( message => {
            this.isLoading = false;
            alert(message);
            if (this.selectedStudent.dbId === data.studentDbId) {
                this.selectedStudent.copyTest(this.currentStudent);
            } else {
                this.classSectionStudentList.forEach( classs => {
                    classs.sectionList.forEach( section => {
                        section.studentList.forEach( student => {
                            if (student.dbId === data.studentDbId) {
                                (student as StudentTest).resultList = [];
                                (student as StudentTest).scholarNumber = null;
                                (student as StudentTest).attendance = null;
                            }
                        })
                    });
                });
            }
        }, error => {
            this.isLoading = false;
        });
    }

    getSubjectName(dbId: any) {
        let name = 'E';
        this.subjectList.forEach( subject => {
            if (subject.dbId.toString() === dbId.toString()) {
                name = subject.name;
                return;
            }
        });
        return name;
    }

    getMaximumMarks(dbId: any) {
        let maxMarks = 0;
        this.maximumMarksAllowedList.forEach( marks => {
            if (marks.dbId.toString() === dbId.toString()) {
                maxMarks = marks.marks;
                return;
            }
        });
        return maxMarks;
    }

    updateCurrentStudentMarks(marks: any, result: any) {
        this.currentStudent.resultList.forEach( currentResult => {
            if (currentResult.testDbId.toString() === result.testDbId.toString()) {
                currentResult.marksObtained = marks;
                return;
            }
        });
    }

}
