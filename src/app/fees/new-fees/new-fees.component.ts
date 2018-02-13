import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Student } from '../../classes/student';
import { Classs } from '../../classes/classs';
import { Fee } from '../../classes/fee';
import { ClassStudentListService } from '../../services/class-student-list.service';
import { StudentService } from '../../services/student.service';
import { NewFeeReceiptService } from '../../services/new-fee-receipt.service';
import {EmitterService} from '../../services/emitter.service';
import {NewConcessionService} from '../../services/new-concession.service';
import {Concession} from '../../classes/concession';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

import moment = require('moment');
import {error} from "util";

export class StudentClass {
    constructor(public studentName: string,
                public studentDbId: number,
                public className: string,
                public classDbId: number) { }
}

@Component({
    selector: 'app-new-fees',
    templateUrl: './new-fees.component.html',
    styleUrls: ['./new-fees.component.css'],
    providers: [ ClassStudentListService, StudentService, NewFeeReceiptService, NewConcessionService ],
})
export class NewFeesComponent implements OnInit, OnDestroy {

    @Input() user;

    selectedStudent: Student;

    // selectedClass: Classs;
    // classList: Classs[];

    newFeeReceipt: Fee;
    newConcession: Concession;

    // noStudentForSelectedClass = true;
    // currentStudent: Student = new Student();

    submitNewFeeReceiptSubscription: any;

    studentClassList: StudentClass[];

    myControl = new FormControl();
    filteredStudentClassList: Observable<StudentClass[]>;

    isLoading = false;

    isListLoading = false;

    constructor (private classStudentListService: ClassStudentListService,
                 private studentService: StudentService,
                 private newFeeReceiptService: NewFeeReceiptService,
                 private newConcessionService: NewConcessionService) { }

    /*onChangeSelectedClass(selectedClass): void {
        this.selectedClass = selectedClass;
        this.populateSelectStudent();
    }

    populateSelectStudent(): void {
        if (this.selectedClass.studentList.length !== 0) {
            // this.noStudentForSelectedClass = false;
            this.selectedStudent = this.selectedClass.studentList[0];
            this.getStudentData();
        } else {
            // this.noStudentForSelectedClass = true;
            this.selectedStudent = null;
        }
    }*/

    ngOnInit(): void {
        this.selectedStudent = new Student();
        this.newFeeReceipt = new Fee();
        this.newFeeReceipt.generationDateTime = moment(new Date()).format('YYYY-MM-DD');
        this.newConcession = new Concession();
        this.submitNewFeeReceiptSubscription = EmitterService.get('submit-new-fee-receipt').subscribe(value => {
            this.submitFee();
        });
        this.isListLoading = true;
        this.classStudentListService.getIndex().then(
            classStudentList => {
                this.isListLoading = false;
                // this.classList = [];
                this.studentClassList = [];
                classStudentList.forEach( classs => {
                    /* const tempClass = new Classs();
                    tempClass.name = classs.name;
                    tempClass.dbId = classs.dbId; */
                    classs.studentList.forEach( student => {
                        /* const tempStudent = new Student();
                        tempStudent.name = student.name;
                        tempStudent.dbId = student.dbId;
                        tempClass.studentList.push(tempStudent); */

                        const tempStudentClass = new StudentClass(student.name, student.dbId, classs.name, classs.dbId);
                        this.studentClassList.push(tempStudentClass);

                    });

                    // this.classList.push(tempClass);

                });

                // this.selectedClass = this.classList[0];
                // this.populateSelectStudent();

                this.filteredStudentClassList = this.myControl.valueChanges
                    .pipe(
                        startWith<string | StudentClass>(''),
                        map(value => typeof value === 'string' ? value : (value as StudentClass).studentName),
                        map(studentName => studentName ? this.filter(studentName.toString()) : this.studentClassList.slice())
                    );
            }, error => {
                this.isListLoading = false;
            }
        );
    }

    ngOnDestroy(): void {
        this.submitNewFeeReceiptSubscription.unsubscribe();
    }

    /*getStudentData(): void {
        this.isLoading = true;
        this.studentService.getStudentData(this.selectedStudent.dbId).then(
            student => {
                this.isLoading = false;
                const breakLoop = false;
                if (this.selectedStudent.dbId === student.dbId) {
                    this.selectedStudent.copy(student);
                    this.currentStudent.copyWithoutFeesAndConcession(student);
                }
                if (student.overAllLastFeeReceiptNumber === null || student.overAllLastFeeReceiptNumber === '') {
                    student.overAllLastFeeReceiptNumber = 0;
                }
                this.newFeeReceipt.receiptNumber = student.overAllLastFeeReceiptNumber + 1;
            }, error => {
                this.isLoading = false;
            }
        );
    }*/

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
        this.newFeeReceipt.studentDbId = this.  selectedStudent.dbId;
        this.newFeeReceiptService.submitStudentFees(this.newFeeReceipt).then(
            data => {
                this.isLoading = false;
                if (data.status === 'success') {
                    alert(data.message);
                    const student = data.studentData;
                    if (this.selectedStudent.dbId === student.dbId) {
                        this.selectedStudent.copy(student);
                        // this.currentStudent.copyWithoutFeesAndConcession(student);
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
                } else {
                    alert(data.message);
                }
            }, error => {
                this.isLoading = false;
                alert('Server error: Contact Admin');
            }
        );

    }

    submitConcession(): void {
        if (this.newConcession.amount === undefined || this.newConcession.amount === 0) {
            alert('Amount should be populated');
            return;
        }
        if (this.newConcession.remark === undefined) { this.newConcession.remark = ''; }
        this.isLoading = true;
        this.newConcession.studentDbId = this.selectedStudent.dbId;
        this.newConcessionService.submitStudentConcession(this.newConcession).then(
            data => {
                this.isLoading = false;
                if (data.status === 'success') {
                    alert(data.message);
                    const student = data.studentData;
                    if (this.selectedStudent.dbId === student.dbId) {
                        this.selectedStudent.copy(student);
                        // this.currentStudent.copyWithoutFeesAndConcession(student);
                    }
                    if (student.overAllLastFeeReceiptNumber === null || student.overAllLastFeeReceiptNumber === '') {
                        student.overAllLastFeeReceiptNumber = 0;
                    }
                    this.newFeeReceipt.receiptNumber = student.overAllLastFeeReceiptNumber + 1;
                } else {
                    alert(data.message);
                }
            }, error => {
                this.isLoading = false;
                alert('Server error: Contact Admin');
            }
        );

    }

    printFeeReceipt(fee: Fee): void {
        fee.fatherName = this.selectedStudent.fathersName;
        fee.studentName = this.selectedStudent.name;
        fee.className =  this.selectedStudent.className;
        EmitterService.get('print-fee-receipt').emit(fee);
    }

    createNewFeeReceipt(): void {
        EmitterService.get('new-fee-receipt-modal').emit(this.newFeeReceipt);
    }

    filter(name: string): StudentClass[] {
        return this.studentClassList.filter(studentClass =>
            studentClass.studentName.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    displayFn(studentClass?: StudentClass): string | undefined {
        return studentClass ? studentClass.studentName + ', ' + studentClass.className : undefined;
    }

    getStudentFeeData(studentClass?: StudentClass): void {
        this.isLoading = true;
        this.studentService.getStudentData(studentClass.studentDbId).then(
            student => {
                this.isLoading = false;
                const breakLoop = false;
                this.selectedStudent.copy(student);
                if (student.overAllLastFeeReceiptNumber === null || student.overAllLastFeeReceiptNumber === '') {
                    student.overAllLastFeeReceiptNumber = 0;
                }
                this.newFeeReceipt.receiptNumber = student.overAllLastFeeReceiptNumber + 1;
            }, error => {
                this.isLoading = false;
            }
        );
    }

}
