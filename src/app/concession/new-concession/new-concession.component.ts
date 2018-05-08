/*import { Component, Input, OnInit } from '@angular/core';

import { TempConcession } from '../../fees/classes/temp-concession';
import { TempStudent } from '../../fees/classes/temp-student';

import { StudentService } from '../../students/student.service';
import { FeeService } from '../../fees/fee.service';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

import moment = require('moment');


@Component({
    selector: 'app-new-concession',
    templateUrl: './new-concession.component.html',
    styleUrls: ['./new-concession.component.css'],
    providers: [ FeeService, StudentService ],
})
export class NewConcessionComponent implements OnInit {

    @Input() user;


    selectedStudent: TempStudent;

    newConcession: TempConcession;

    myControl = new FormControl();

    studentList: TempStudent[] = [];
    filteredStudentList: Observable<Array<TempStudent>>;

    isLoading = false;

    isListLoading = false;

    constructor (private studentService: StudentService,
                 private feeService: FeeService) { }

    ngOnInit(): void {
        this.selectedStudent = new TempStudent();
        this.newConcession = new TempConcession();
        this.newConcession.generationDateTime = moment(new Date()).format('YYYY-MM-DD');
        this.isListLoading = true;
        const data = {
            sessionDbId: this.user.schoolCurrentSessionDbId,
        }
        this.studentService.getClassSectionStudentList(data, this.user.jwt).then(
            classSectionStudentList => {
                this.isListLoading = false;
                classSectionStudentList.forEach( classs => {
                    classs.sectionList.forEach( section => {
                        section.studentList.forEach( student => {
                            const tempStudent = new TempStudent();
                            tempStudent.copy(student);
                            tempStudent.className = classs.name;
                            if (classs.sectionList.length > 1) {
                                tempStudent.sectionName = section.name;
                            }
                            this.studentList.push(tempStudent);
                        });
                    });
                });
                this.filteredStudentList = this.myControl.valueChanges.pipe(
                    startWith<String | TempStudent>(''),
                    map(value => typeof value === 'string' ? value: (value as TempStudent).name),
                    map(name => this.filter(name.toString()))
                )
            }
        );
    }

    filter(name: string): any {
        if (name === '') {
            return [];
        }
        return this.studentList.filter( student => student.name.toLowerCase().indexOf(name.toLowerCase()) === 0 );
    }

    displayFn(student?: TempStudent) {
        if (student) {
            return student.name + ', ' + student.className
                + ((student.sectionName && student.sectionName !== '')? ', ' + student.sectionName: '');
        } else {
            return '';
        }
    }

    submitConcession(): void {
        if (this.newConcession.amount === undefined || this.newConcession.amount === 0) {
            alert('Amount should be populated');
            return;
        }
        if (this.newConcession.remark === undefined) { this.newConcession.remark = ''; }
        this.isLoading = true;
        this.newConcession.studentDbId = this.selectedStudent.dbId;
        this.feeService.giveConcesssion(this.newConcession, this.user.jwt).then(
            data => {
                this.isLoading = false;
                alert(data.message);
                const student = data.studentData;
                if (this.selectedStudent.dbId === student.dbId) {
                    student.name = this.selectedStudent.name;
                    student.className = this.selectedStudent.className;
                    student.sectionName = this.selectedStudent.sectionName;
                    student.feesList.forEach(fee => {
                        fee.studentName = student.name;
                        fee.fathersName = student.fathersName;
                        fee.className = student.className;
                        fee.sectionName = student.sectionName;
                        fee.scholarNumber = student.scholarNumber;
                    });
                    student.concessionList.forEach(concession => {
                        concession.studentName = student.name;
                        concession.className = student.className;
                        concession.scholarNumber = student.scholarNumber;
                    });
                    this.selectedStudent.copy(student);
                }
            }
        );

    }

    getStudentFeeData(student?: TempStudent): void {
        this.isLoading = true;
        const data = {
            studentDbId: student.dbId,
        };
        this.feeService.getStudentFeeData(data, this.user.jwt).then(
            studentResponse => {
                this.isLoading = false;
                studentResponse.name = student.name;
                studentResponse.className = student.className;
                studentResponse.sectionName = student.sectionName;
                studentResponse.feesList.forEach( fee => {
                    fee.studentName = student.name;
                    fee.scholarNumber = studentResponse.scholarNumber;
                    fee.fathersName = studentResponse.fathersName;
                    fee.className = student.className;
                    fee.sectionName = student.sectionName;
                });
                studentResponse.concessionList.forEach( concession => {
                    concession.studentName = student.name;
                    concession.className = student.className;
                    concession.sectionName = student.sectionName;
                });
                this.selectedStudent.copy(studentResponse);
                if (studentResponse.overAllLastFeeReceiptNumber === null || studentResponse.overAllLastFeeReceiptNumber === '') {
                    studentResponse.overAllLastFeeReceiptNumber = 0;
                }
            }
        );
    }

}
*/