import { Component, Input, OnInit } from '@angular/core';

import { MarksheetService } from '../marksheet.service';
import {StudentOldService} from '../../students/student-old.service';

import {StudentTest} from '../classes/student-test';

import {FormControl} from '@angular/forms';
import { Observable } from "rxjs";
import { startWith, map} from 'rxjs/operators';

import { PrintService } from '../../../print/print-service';
import { PRINT_MARKSHEET_SECOND_FORMAT, PRINT_MARKSHEET } from '../../../print/print-routes.constants';
import {DataStorage} from "../../../classes/data-storage";

@Component({
    selector: 'view-marksheet',
    templateUrl: './view-marksheet.component.html',
    styleUrls: ['./view-marksheet.component.css'],
    providers: [ MarksheetService, StudentOldService ]
})

export class ViewMarksheetComponent implements OnInit {

    user;

    myControl = new FormControl();

    studentList: StudentTest[] = [];
    filteredStudentList: Observable<Array<StudentTest>>;

    marksheet: any;

    nextClassName: string;

    isLoading = false;

    isListLoading = false;

    constructor(private marksheetService: MarksheetService,
                private studentService: StudentOldService,
                private printService: PrintService) { }


    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.isListLoading = true;
        const data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
            schoolDbId: this.user.activeSchool.dbId,
        };
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
                            studentTest.classDbId = classs.dbId;
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
        let routeName;
        if (this.user.username === 'bhagatsingh' || this.user.username === 'brightstarsalsalai') {
            routeName = PRINT_MARKSHEET_SECOND_FORMAT;
        } else {
            routeName = PRINT_MARKSHEET;
        }

        this.printService.navigateToPrintRoute(routeName, {user: this.user, value: this.marksheet});
    }

    getStudentMarksheet(student?: StudentTest): void {
        this.isLoading = true;
        const data = {
            studentDbId: student.dbId,
            sectionDbId: student.sectionDbId,
            classDbId: student.classDbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
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
