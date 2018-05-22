import { Component, Input, OnInit } from '@angular/core';

import { MarksheetService } from '../marksheet.service';
import {StudentService} from '../../students/student.service';

import {EmitterService} from '../../../services/emitter.service';
import {StudentTest} from '../classes/student-test';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

import moment = require('moment');

@Component({
    selector: 'view-marksheet',
    templateUrl: './view-marksheet.component.html',
    styleUrls: ['./view-marksheet.component.css'],
    providers: [ MarksheetService, StudentService ]
})

export class ViewMarksheetComponent implements OnInit {

    @Input() user;

    myControl = new FormControl();

    studentList: StudentTest[] = [];
    filteredStudentList: Observable<Array<StudentTest>>;

    marksheet: any;

    nextClassName: string;

    isLoading = false;

    isListLoading = false;

    constructor(private marksheetService: MarksheetService,
                private studentService: StudentService) { }


    ngOnInit(): void {
        this.isListLoading = true;
        const data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
            schoolDbId: this.user.activeSchool.dbId,
        }
        this.studentService.getClassSectionStudentList(data, this.user.jwt).then(
            classSectionStudentList => {
                this.isListLoading = false;
                classSectionStudentList.forEach( classs => {
                    classs.sectionList.forEach( section => {
                        section.studentList.forEach( student => {
                            const studentTest = new StudentTest();
                            // studentTest.copyTest(student);
                            studentTest.copy(student);
                            studentTest.className = classs.name;
                            studentTest.sectionName = section.name;
                            studentTest.sectionDbId = section.dbId;
                            if (classs.sectionList.length > 1) {
                                studentTest.showSectionName = true;
                            }
                            this.studentList.push(studentTest);
                        });
                    });
                });
                this.filteredStudentList = this.myControl.valueChanges.pipe(
                    startWith<String | StudentTest>(''),
                    map(value => typeof value === 'string' ? value: (value as StudentTest).name),
                    map(name => this.filter(name.toString()))
                )
            }, error => {
                this.isListLoading = false;
            }
        );
    }

    filter(name: string): any {
        if (name === '') {
            return [];
        }
        return this.studentList.filter( student => student.name.toLowerCase().indexOf(name.toLowerCase()) === 0 );
    }

    displayFn(student?: StudentTest) {
        if (student) {
            return student.name + ', ' + student.className
                + ((student.showSectionName)? ', ' + student.sectionName: '');
        } else {
            return '';
        }
    }

    printMarksheet(): void {
        this.marksheet.nextClassName = this.nextClassName;
        if (this.user.username === 'bhagatsingh' || this.user.username === 'brightstarsalsalai') {
            EmitterService.get('print-marksheet-second-format').emit(this.marksheet);
        } else {
            EmitterService.get('print-marksheet').emit(this.marksheet);
        }
    }

    getStudentMarksheet(student?: StudentTest): void {
        this.isLoading = true;
        const data = {
            studentDbId: student.dbId,
            sectionDbId: student.sectionDbId,
        };
        this.marksheetService.getStudentMarksheet(data, this.user.jwt).then(
            marksheet => {
                this.isLoading = false;
                this.marksheet = marksheet;
            }, error => {
                this.isLoading = false;
            }
        );
    }

    getTotalMaximumMarks(marksheet: any) {
        let totalMarks = 0;
        marksheet.result.forEach( result => {
            if (result.governmentSubject) {
                totalMarks += result.maximumMarks;
            }
        });
        return totalMarks;
    }

    getTotalMarksObtained(marksheet: any) {
        let totalMarksObtained = 0;
        marksheet.result.forEach( result => {
            if (result.governmentSubject) {
                totalMarksObtained += parseFloat(result.marksObtained);
            }
        });
        return totalMarksObtained;
    }

    getPercentage(marksheet: any) {
        return this.getTotalMarksObtained(marksheet)/this.getTotalMaximumMarks(marksheet)*100;
    }

}
