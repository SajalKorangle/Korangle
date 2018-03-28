import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { TempFee } from '../classes/temp-fee';
import { TempStudent } from '../classes/temp-student';


import { StudentService } from '../../students/student.service';
import { EmitterService } from '../../services/emitter.service';

import { FeeService } from '../fee.service';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

import moment = require('moment');

@Component({
    selector: 'app-new-fees',
    templateUrl: './new-fees.component.html',
    styleUrls: ['./new-fees.component.css'],
    providers: [ StudentService, FeeService ],
})
export class NewFeesComponent implements OnInit, OnDestroy {

    @Input() user;

    selectedStudent: TempStudent;

    newFeeReceipt: TempFee;

    submitNewFeeReceiptSubscription: any;

    myControl = new FormControl();

    studentList: TempStudent[] = [];
    filteredStudentList: Observable<Array<TempStudent>>;

    isLoading = false;

    isListLoading = false;

    constructor (private studentService: StudentService,
                 private feeService: FeeService) { }

    ngOnInit(): void {
        this.selectedStudent = new TempStudent();
        this.newFeeReceipt = new TempFee();
        this.newFeeReceipt.generationDateTime = moment(new Date()).format('YYYY-MM-DD');
        this.submitNewFeeReceiptSubscription = EmitterService.get('submit-new-fee-receipt').subscribe(value => {
            this.submitFee();
        });
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

    ngOnDestroy(): void {
        this.submitNewFeeReceiptSubscription.unsubscribe();
    }

    submitFee(): void {
        if (this.newFeeReceipt.receiptNumber === undefined || this.newFeeReceipt.receiptNumber === 0) {
            alert('Receipt No. should be populated');
            return;
        }
        if (this.newFeeReceipt.amount === undefined || this.newFeeReceipt.amount <= 0) {
            alert('Amount should be populated');
            return;
        }
        if (this.newFeeReceipt.generationDateTime === undefined) {
            alert('Date should be populated');
            return;
        }
        if (this.newFeeReceipt.remark === undefined) { this.newFeeReceipt.remark = ''; }
        this.isLoading = true;
        this.newFeeReceipt.studentDbId = this.selectedStudent.dbId;
        this.feeService.submitFee(this.newFeeReceipt, this.user.jwt).then(
            data => {
                this.isLoading = false;
                if (data.status === 'success') {
                    alert(data.message);
                    const student = data.studentData;
                    if (this.selectedStudent.dbId === student.dbId) {
                        student.name = this.selectedStudent.name;
                        student.className = this.selectedStudent.className;
                        student.sectionName = this.selectedStudent.sectionName;
                        student.feesList.forEach( fee => {
                            fee.studentName = student.name;
                            fee.fathersName = student.fathersName;
                            fee.className = student.className;
                            fee.sectionName = student.sectionName;
                        });
                        student.concessionList.forEach( concession => {
                            concession.studentName = student.name;
                            concession.className = student.className;
                        });
                        this.selectedStudent.copy(student);
                    }
                    this.selectedStudent.feesList.forEach( fee => {
                        if (fee.receiptNumber === this.newFeeReceipt.receiptNumber) {
                            this.printFeeReceipt(fee);
                        }
                    });
                    if (student.overAllLastFeeReceiptNumber === null || student.overAllLastFeeReceiptNumber === '') {
                        student.overAllLastFeeReceiptNumber = 0;
                    }
                    this.newFeeReceipt.receiptNumber = student.overAllLastFeeReceiptNumber + 1;
                    this.newFeeReceipt.amount = 0;
                    this.newFeeReceipt.generationDateTime = moment(new Date()).format('YYYY-MM-DD');
                    this.newFeeReceipt.remark = '';
                } else if (data.status === 'fail') {
                    alert(data.message);
                } else {
                    alert('Server Response not recognized: Contact Admin');
                }
            }
        );

    }

    printFeeReceipt(fee: TempFee): void {
        EmitterService.get('print-fee-receipt').emit(fee);
    }

    createNewFeeReceipt(): void {
        EmitterService.get('new-fee-receipt-modal').emit(this.newFeeReceipt);
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
                    concession.scholarNumber = student.scholarNumber;
                });
                this.selectedStudent.copy(studentResponse);
                if (studentResponse.overAllLastFeeReceiptNumber === null || studentResponse.overAllLastFeeReceiptNumber === '') {
                    studentResponse.overAllLastFeeReceiptNumber = 0;
                }
                this.newFeeReceipt.receiptNumber = studentResponse.overAllLastFeeReceiptNumber + 1;
            }
        );
    }

}
