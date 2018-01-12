import { Component, OnInit } from '@angular/core';

import { Student } from '../classes/student';
import { Classs } from '../classes/classs';
import { Fee } from '../classes/fee';
import { ClassStudentListService } from '../services/class-student-list.service';
import { StudentService } from '../services/student.service';
import { NewFeeReceiptService } from '../services/new-fee-receipt.service';
import { AuthenticationService } from '../services/authentication.service';
import {EmitterService} from '../services/emitter.service';
import {NewConcessionService} from '../services/new-concession.service';
import {Concession} from '../classes/concession';

import moment = require('moment');

@Component({
  selector: 'app-student',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
    providers: [ ClassStudentListService, StudentService, NewFeeReceiptService, AuthenticationService, NewConcessionService ],
})
export class StudentComponent implements OnInit {

  selectedStudent: Student;
  selectedClass: Classs;
  classList: Classs[];
  newFeeReceipt: Fee;
  newConcession: Concession;
  // noStudentForSelectedClass = true;
  currentStudent: Student = new Student();
  username: any;

  isLoading = false;

    constructor (private classStudentListService: ClassStudentListService,
                 private studentService: StudentService,
                 private newFeeReceiptService: NewFeeReceiptService,
                 private newConcessionService: NewConcessionService,
                 private authenticationService: AuthenticationService) { }

    onChangeSelectedClass(selectedClass): void {
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
    }

    ngOnInit(): void {
        this.newFeeReceipt = new Fee();
        this.newFeeReceipt.generationDateTime = moment(new Date()).format('YYYY-MM-DD');
        console.log(this.newFeeReceipt.generationDateTime);
        this.newConcession = new Concession();
        this.classStudentListService.getIndex().then(
            classStudentList => {
                this.classList = [];
                classStudentList.forEach( classs => {
                    const tempClass = new Classs();
                    tempClass.name = classs.name;
                    tempClass.dbId = classs.dbId;
                    classs.studentList.forEach( student => {
                        const tempStudent = new Student();
                        tempStudent.name = student.name;
                        tempStudent.dbId = student.dbId;
                        tempClass.studentList.push(tempStudent);
                    });
                    this.classList.push(tempClass);
                });
                this.selectedClass = this.classList[0];
                this.populateSelectStudent();
            }
        );
    }

    getStudentData(): void {
        this.isLoading = true;
        this.studentService.getStudentData(this.selectedStudent.dbId).then(
            student => {
                console.log(student);
                this.isLoading = false;
                const breakLoop = false;
                if (this.selectedStudent.dbId === student.dbId) {
                    this.selectedStudent.copy(student);
                    this.currentStudent.copyWithoutFeesAndConcession(student);
                }
                // console.log(student);
                if (student.overAllLastFeeReceiptNumber === null || student.overAllLastFeeReceiptNumber === '') {
                    student.overAllLastFeeReceiptNumber = 0;
                }
                this.newFeeReceipt.receiptNumber = student.overAllLastFeeReceiptNumber + 1;
                // alert(this.newFeeReceipt.receiptNumber);
                /*else {
                    alert("Error: Select student again");
                }*/
                /*else {
                    this.classList.forEach( classs => {
                        classs.studentList.forEach( tempStudent => {
                            if (tempStudent.dbId === student.dbId) {
                                tempStudent.copy(student);
                                breakLoop = true;
                                return;
                            }
                        });
                        if (breakLoop) { return; }
                    });
                }*/
            }, error => {
                this.isLoading = false;
            }
        );
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
        this.newFeeReceiptService.submitStudentFees(this.newFeeReceipt).then(
            data => {
                this.isLoading = false;
                if (data.status === 'success') {
                    alert(data.message);
                    const student = data.studentData;
                    if (this.selectedStudent.dbId === student.dbId) {
                        this.selectedStudent.copy(student);
                        this.currentStudent.copyWithoutFeesAndConcession(student);
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
                        this.currentStudent.copyWithoutFeesAndConcession(student);
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

    updateProfile(): void {
        this.isLoading = true;
        this.studentService.updateStudentData(this.currentStudent).then(
            student => {
                this.isLoading = false;
                let breakLoop = false;
                if (this.selectedStudent.dbId === student.dbId) {
                    this.selectedStudent.copy(student);
                    alert('Student updated successfully');
                } else {
                    this.classList.forEach( classs => {
                        classs.studentList.forEach( tempStudent => {
                            if (tempStudent.dbId === student.dbId) {
                                tempStudent.copy(student);
                                breakLoop = true;
                                return;
                            }
                        });
                        if (breakLoop) { return; }
                    });
                    alert('Student: ' + student.name + ' updated successfully');
                }
            }
        );
    }

    deleteProfile(): void {
        if (!confirm('Are you sure you want to delete ' + this.currentStudent.name + '\'s profile.')) {
            return;
        }
        this.isLoading = true;
        this.studentService.deleteStudentProfile(this.currentStudent.dbId).then( data => {
            alert(data['message']);
            this.isLoading = false;
            let studentIndex = 0;
            if (data['status'] === 'success') {
                this.selectedClass.studentList.forEach( (student, index) => {
                    if (student.dbId === data['studentDbId']) {
                        studentIndex = index;
                    }
                });
            }
            this.selectedClass.studentList.splice(studentIndex, 1);
            this.populateSelectStudent();
        }, error => {
            this.isLoading = false;
            alert('Server Error: Contact admin');
        });
    }

    printFeeReceipt(fee: Fee): void {
        fee.fatherName = this.selectedStudent.fathersName;
        fee.studentName = this.selectedStudent.name;
        fee.className =  this.selectedClass.name;
        EmitterService.get('print-fee-receipt').emit(fee);
    }

    /*checkAuthentication(): void {
        this.authenticationService.checkAuthentication().then(
            response => {
                console.log(response);
            }
        );
    }

    login(): void {
        this.authenticationService.login('arnava', 'harshal03').then(
            response => {
                console.log(response);
            }
        )
    }

    logout(): void {
        this.authenticationService.logout().then(
            response => {
                console.log(response);
            }
        )
    }*/

}
